require('./treasure_area_inline_create.less');
require('../../common/service.js');
const uuid = require('node-uuid');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-area.inline-create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaInlineCreateController', ExhibitionAreaInlineCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.treasure-area-list.treasure-area-inline-create', {
        url: '/_create',
        template: require('./treasure_area_inline_create.html'),
        controller: 'ExhibitionAreaInlineCreateController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaInlineCreateController($scope, Restangular, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('treasure-areas');
    const MapFeature = Restangular.all('map-features');
    vm.createExhibitionArea = createExhibitionArea;
    vm.exhibitionArea = {
        color: '#a62e02',
    };

    $scope.$on('current-map', whenMapChange);
    $scope.$on('draw-position-change', onPositionChange);
    $scope.$on('map-change', whenMapChange);
    $scope.$emit('get-current-map');

    function whenMapChange(event, data) {
        if (data && data.map) {
            const map = data.map;
            vm.exhibitionArea.JCObjId = map.profile.JCObjId;
            vm.exhibitionArea.JCObjMask = map.profile.JCObjMask;
            vm.exhibitionArea.JCRight = map.profile.JCRight;
            vm.exhibitionArea.JCBottom = map.profile.JCBottom;
            vm.exhibitionArea.profileId = map.profile.JCObjId + ':' + map.profile.JCObjMask;
            vm.exhibitionArea.layer = map.layers.filter((layer) => {
                return layer.JCName === 'trade_area';
            })[0];
        }
    }

    function onPositionChange(event, data) {
        if (!data.position) { return; }
        const points = data.position.split(',').map(parseFloat);
        vm.exhibitionArea.geoData = [];
        for (let i = 0, len = points.length / 2; i < len; i += 1) {
            vm.exhibitionArea.geoData[i] = [points[i * 2], points[i * 2 + 1]];
        }
    }

    function createExhibitionArea(exhibitionArea) {
        const xs = exhibitionArea.geoData.map((d) => d[0]);
        const ys = exhibitionArea.geoData.map((d) => d[1]);
        const JCGUID = uuid.v4();

        exhibitionArea.feature = {};
        exhibitionArea.feature.JCAuthor = 'admin';
        exhibitionArea.feature.JCBottom = Math.max(...ys);
        exhibitionArea.feature.JCBack = 0;
        exhibitionArea.feature.JCFront = 0;
        exhibitionArea.feature.JCCreateTime = Date.now();
        exhibitionArea.feature.JCFeatureType = 'polygon';
        exhibitionArea.feature.JCGUID = JCGUID;
        exhibitionArea.feature.JCGeoData = exhibitionArea.geoData.map((p) => p.join(',')).join(' ');
        exhibitionArea.feature.JCGeoHash = 0;
        exhibitionArea.feature.JCLayerName = 'trade_area';
        exhibitionArea.feature.JCLeft = Math.min(...xs);
        exhibitionArea.feature.JCModifier = '';
        exhibitionArea.feature.JCModifyTime = 0;
        exhibitionArea.feature.JCRight = Math.max(...xs);
        exhibitionArea.feature.JCState = 0;
        exhibitionArea.feature.JCTop = Math.min(...ys);
        exhibitionArea.feature.color = parseInt(exhibitionArea.color.slice(1), 16);
        exhibitionArea.feature.JCARGB = parseInt(exhibitionArea.color.slice(1), 16);
        exhibitionArea.feature.des = exhibitionArea.description;
        exhibitionArea.feature.name = exhibitionArea.name;
        exhibitionArea.feature.type = 0;
        exhibitionArea.feature.uri = '';

        MapFeature.post(exhibitionArea).then((res) => {
            exhibitionArea.JC_Id = res.JC_Id;
            exhibitionArea.JCGUID = JCGUID;
            return ExhibitionArea.post(exhibitionArea);
        }).then(() => {
            $scope.$emit('treasure-area-change');
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
