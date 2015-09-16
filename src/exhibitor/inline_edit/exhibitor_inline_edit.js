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
    $stateProvider.state('pavilion-map.exhibitor-list.exhibitor-inline-edit', {
        url: '/:exhibitorId',
        template: require('./exhibitor_inline_edit.html'),
        controller: 'ExhibitorInlineEditController as vm',
    });
}


/* @ngInject */
function ExhibitorInlineEditController(Restangular, $scope, $stateParams, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    const MapFeature = Restangular.all('map-features');

    vm.floors = config.floors.slice(1);
    vm.updateExhibitor = updateExhibitor;
    vm.exhibitor = Exhibitor.get($stateParams.exhibitorId).$object;

    $scope.$on('current-map', whenMapChange);
    $scope.$on('draw-position-change', onPositionChange);
    $scope.$on('map-change', whenMapChange);
    $scope.$emit('get-current-map');

    function whenMapChange(event, data) {
        if (data && data.map) {
            const map = data.map;
            vm.exhibitor.JCObjId = map.profile.JCObjId;
            vm.exhibitor.JCObjMask = map.profile.JCObjMask;
            vm.exhibitor.JCRight = map.profile.JCRight;
            vm.exhibitor.JCBottom = map.profile.JCBottom;
            vm.exhibitor.profileId = map.profile.JCObjId + ':' + map.profile.JCObjMask;
            vm.exhibitor.layer = map.layers.filter((layer) => {
                return layer.JCName === 'stall';
            })[0];
        }
    }

    function onPositionChange(event, data) {
        if (!data.position) { return; }
        const points = data.position.split(',').map(parseFloat);
        vm.exhibitor.geoData = [];
        for (let i = 0, len = points.length / 2; i < len; i += 1) {
            vm.exhibitor.geoData[i] = [points[i * 2], points[i * 2 + 1]];
        }
        vm.exhibitor.geoData._changed = true;
    }

    function updateExhibitor(exhibitor) {
        const xs = exhibitor.geoData.map((d) => d[0]);
        const ys = exhibitor.geoData.map((d) => d[1]);
        const JCGUID = uuid.v4();

        exhibitor.feature = {};
        exhibitor.feature.JCAuthor = 'admin';
        exhibitor.feature.JCBottom = Math.max(...ys);
        exhibitor.feature.JCBack = 0;
        exhibitor.feature.JCFront = 0;
        exhibitor.feature.JCCreateTime = Date.now();
        exhibitor.feature.JCFeatureType = 'polygon';
        exhibitor.feature.JCGUID = JCGUID;
        exhibitor.feature.JCGeoData = exhibitor.geoData.map((p) => p.join(',')).join(' ');
        exhibitor.feature.JCGeoHash = 0;
        exhibitor.feature.JCLayerName = 'stall';
        exhibitor.feature.JCLeft = Math.min(...xs);
        exhibitor.feature.JCModifier = '';
        exhibitor.feature.JCModifyTime = 0;
        exhibitor.feature.JCRight = Math.max(...xs);
        exhibitor.feature.JCState = 0;
        exhibitor.feature.JCTop = Math.min(...ys);
        exhibitor.feature.color = 1350339707;
        exhibitor.feature.JCARGB = 1350339707;
        exhibitor.feature.des = exhibitor.description;
        exhibitor.feature.name = exhibitor.title;
        exhibitor.feature.type = parseInt(exhibitor.beaconId, 10);

        if (exhibitor.JCGUID) {
            MapFeature.doDELETE(exhibitor.JCGUID, {
                JCLayerName: exhibitor.JCLayerName,
                profileId: exhibitor.profileId,
            });
        }

        MapFeature.post(exhibitor).then((res) => {
            exhibitor.JC_Id = res.JC_Id;
            exhibitor.JCGUID = JCGUID;

            return exhibitor.doPUT(exhibitor, 'position');
        }).then(() => {
            $scope.$emit('exhibitor-change');
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
