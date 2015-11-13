require('../../common/service.js');
require('../list/exhibitor_list.js');
const config = require('../../config.json');
const angular = require('angular');
const uuid = require('node-uuid');
const ol = require('openlayers');

module.exports = angular.module('ememtn.exhibitor.inline-edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitorInlineEditController', ExhibitorInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-inline-edit', {
        url: '/exhibitors-position/:exhibitorId',
        template: require('./exhibitor_inline_edit.html'),
        controller: 'ExhibitorInlineEditController as vm',
    });
}


/* @ngInject */
function ExhibitorInlineEditController($q, Restangular, $timeout, $stateParams, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    const MapFeature = Restangular.all('map-features');

    vm.floors = config.floors.slice(1);
    vm.updateExhibitor = updateExhibitor;
    vm.onDrawEnd = onDrawEnd;
    vm.onSelectStall = onSelectStall;
    vm.onMapCreated = onMapCreated;
    vm.addDrawExhibitorInteraction = addDrawExhibitorInteraction;
    vm.removeSelectedExhibitorArea = removeSelectedExhibitorArea;
    vm.onLayerChange = onLayerChange;
    vm.exhibitor = Exhibitor.get($stateParams.exhibitorId).$object;

    function onSelectStall(stall) {
        vm.stall = stall;
    }

    function updateExhibitor(exhibitor) {
        if (!vm.stall) { return AlertService.warning('未选择展商位置'); }
        if (vm.stall.getProperties().JCGUID === exhibitor.JCGUID) { return AlertService.success('保存成功'); }

        const feature = vm.stall.getProperties();
        const geoData = vm.stall.getGeometry().getCoordinates()[0];

        const _exhibitor = exhibitor.plain();
        _exhibitor.JCGUID = feature.JCGUID;
        _exhibitor.geoData = geoData;

        exhibitor.JCGUID = feature.JCGUID;
        exhibitor.geoData = geoData;

        exhibitor.doPUT(exhibitor, 'position').then(() => {
            AlertService.success('保存成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onDrawEnd(coordinates) {
        const xs = coordinates.map((d) => d[0]);
        const ys = coordinates.map((d) => d[1]);

        const feature = {};
        feature.JCObjId = vm.exhibitor.JCObjId;
        feature.JCObjMask = vm.exhibitor.JCObjMask;
        feature.JCLayerName = vm.exhibitor.JCLayerName;
        feature.JCAuthor = 'admin';
        feature.JCBottom = Math.max(...ys);
        feature.JCBack = 0;
        feature.JCFront = 0;
        feature.JCCreateTime = Date.now();
        feature.JCFeatureType = 'polygon';
        feature.JCGUID = uuid.v4();
        feature.JCGeoData = coordinates.map((p) => p.join(',')).join(' ');
        feature.JCGeoHash = 0;
        feature.JCLayerName = 'stall';
        feature.JCLeft = Math.min(...xs);
        feature.JCModifier = '';
        feature.JCModifyTime = 0;
        feature.JCRight = Math.max(...xs);
        feature.JCState = 0;
        feature.JCTop = Math.min(...ys);
        feature.color = 1350339707;
        feature.JCARGB = 1350339707;
        feature.des = vm.exhibitor.des;
        feature.name = vm.exhibitor.name;

        MapFeature.post(feature).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onMapCreated(map) {
        vm._map = map;
        _addSelectInteraction(map);
    }

    function addDrawExhibitorInteraction() {
        if (!vm._map) {
            return AlertService.warning('地图尚未初始化，请稍后再试');
        }
        drawExhibitorInteraction(vm._map);
    }

    function drawExhibitorInteraction(map) {
        const features = new ol.Collection();

        const featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    // color: 'rgba(255, 255, 255, 0.8)',
                    // color: '#96A395',
                    color: '#eebb33',
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33',
                    }),
                }),
            }),
            zIndex: 110,
        });

        const interaction = new ol.interaction.Draw({
            features: features,
            type: 'Polygon',
        });

        interaction.on('drawend', (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry();
            const coordinates = geometry.getCoordinates()[0].map((coord) => {
                return ol.proj.transform(coord, 'EPSG:4326', 'JCMap');
            });

            map.removeInteraction(interaction);
            onDrawEnd(coordinates);
        });

        map.addLayer(featureOverlay);
        map.addInteraction(interaction);
    }

    function _addSelectInteraction(map, layer) {
        const interaction = new ol.interaction.Select({
            features: layer,
        });

        interaction.on('select', (event) => {
            if (event.selected[0]) {
                const feature = event.selected[0];
                $timeout(() => {
                    vm._selectedExhibitorLayer = layer;
                    vm._selectedExhibitorArea = feature;
                }, 0);
                onSelectStall(feature);
            }
        });

        map.addInteraction(interaction);
    }

    function removeSelectedExhibitorArea() {
        if (!vm._selectedExhibitorArea) { return AlertService.warning('尚未选择任何区域'); }
        const layer = vm._selectedExhibitorLayer;
        const feature = vm._selectedExhibitorArea;
        layer.getSource().removeFeature(feature);

        const properties = feature.getProperties();
        MapFeature.one(properties.JCGUID).remove({
            profileId: `${properties.JCObjId}:${properties.JCObjMask}`,
            JCLayerName: properties.JCLayerName,
        }).then(() => {
            AlertService.success('删除成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onLayerChange(event) {
        const attributions = event.element.getSource().getAttributions();
        if (!attributions) { return; }
        const isStallLayer = attributions.some((attr) => {
            return attr.layerName === 'stall';
        });
        if (isStallLayer) {
            _addSelectInteraction(vm._map, event.element);
        }
    }
}
