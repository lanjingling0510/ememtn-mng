require('../../common/service.js');
require('../list/exhibitor_list.js');
const config = require('../../config.json');
const angular = require('angular');
const uuid = require('node-uuid');

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
function ExhibitorInlineEditController($q, Restangular, $scope, $stateParams, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    const MapFeature = Restangular.all('map-features');

    vm.floors = config.floors.slice(1);
    vm.updateExhibitor = updateExhibitor;
    vm.onDrawEnd = onDrawEnd;
    vm.onSelectStall = onSelectStall;
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
}
