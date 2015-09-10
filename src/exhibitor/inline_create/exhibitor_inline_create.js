require('../../common/service.js');
require('../list/exhibitor_list.js');
const uuid = require('node-uuid');
const angular = require('angular');
const modalTemplate = require('./modal.html');

module.exports = angular.module('ememtn.exhibitor.inline-create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitorInlineCreateController', ExhibitorInlineCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual.exhibitor-list.exhibitor-inline-create', {
        url: '/_create',
        template: require('./exhibitor_inline_create.html'),
        controller: 'ExhibitorInlineCreateController as vm',
    });
}


/* @ngInject */
function ExhibitorInlineCreateController($scope, Restangular, AlertService, commonModal) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    const MapFeature = Restangular.all('map-features');
    vm.createExhibitor = createExhibitor;
    vm.exhibitor = {
        color: '#a69b92',
    };
    commonModal.fromTemplateUrl(modalTemplate, {scope: $scope}).then(function (modal) {
        vm.modal = modal;
        vm.modal.show();
    });
    $scope.$on('current-map', onMapChange);
    $scope.$on('map-change', onMapChange);
    $scope.$on('draw-position-change', onPositionChange);
    $scope.$emit('get-current-map');

    function onMapChange(event, data) {
        if (data && data.map && data.map.profile) {
            vm.exhibitor.JCObjId = data.map.profile.JCObjId;
            vm.exhibitor.JCObjMask = data.map.profile.JCObjMask;
            vm.exhibitor.profileId = data.map.profile.JCObjId + ':' + data.map.profile.JCObjMask;
            vm.exhibitor.layer = data.map.layers.filter((layer) => {
                return layer.JCName === 'stall';
            })[0];
        }
    }

    function onPositionChange(event, data) {
        if (!data.position) {
            return;
        }
        const points = data.position.split(',').map(parseFloat);
        vm.exhibitor.geo = [];
        for (let i = 0, len = points.length / 2; i < len; i += 1) {
            vm.exhibitor.geo[i] = [points[i * 2], points[i * 2 + 1]];
        }
    }

    function createExhibitor(exhibitor) {
        const xs = exhibitor.geo.map((d) => d[0]);
        const ys = exhibitor.geo.map((d) => d[1]);
        const JCGUID = uuid.v4();

        exhibitor.feature = {};
        exhibitor.feature.JCAuthor = 'admin';
        exhibitor.feature.JCBottom = Math.max(...ys);
        exhibitor.feature.JCBack = 0;
        exhibitor.feature.JCFront = 0;
        exhibitor.feature.JCCreateTime = Date.now();
        exhibitor.feature.JCFeatureType = 'polygon';
        exhibitor.feature.JCGUID = JCGUID;
        exhibitor.feature.JCGeoData = '';
        exhibitor.feature.JCGeoHash = 0;
        exhibitor.feature.JCLayerName = 'trade_area';
        exhibitor.feature.JCLeft = Math.min(...xs);
        exhibitor.feature.JCModifier = '';
        exhibitor.feature.JCModifyTime = 0;
        exhibitor.feature.JCRight = Math.max(...xs);
        exhibitor.feature.JCState = 0;
        exhibitor.feature.JCTop = Math.min(...ys);
        exhibitor.feature.color = parseInt(exhibitor.color.slice(1), 16);
        exhibitor.feature.JCARGB = parseInt(exhibitor.color.slice(1), 16);
        exhibitor.feature.des = exhibitor.description;
        exhibitor.feature.name = exhibitor.name;
        exhibitor.feature.type = 0;
        exhibitor.feature.uri = '';

        MapFeature.post(exhibitor).then((res) => {
            exhibitor.JC_Id = res.JC_Id;
            exhibitor.JCGUID = JCGUID;
            return Exhibitor.post(exhibitor);
        }).then(() => {
            $scope.$emit('exhibitor-change');
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
