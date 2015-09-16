require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-point.inline-create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasurePointInlineCreateController', TreasurePointInlineCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.treasure-point-list.treasure-point-inline-create', {
        url: '/_create',
        template: require('./treasure_point_inline_create.html'),
        controller: 'TreasurePointInlineCreateController as vm',
    });
}


/* @ngInject */
function TreasurePointInlineCreateController($scope, Restangular, AlertService) {
    const vm = this;
    const TreasurePoint = Restangular.all('beacons');
    vm.createTreasurePoint = createTreasurePoint;
    vm.treasurePoint = {};

    $scope.$on('current-map', whenMapChange);
    $scope.$on('draw-position-change', onPositionChange);
    $scope.$on('map-change', whenMapChange);
    $scope.$emit('get-current-map');

    function whenMapChange(event, data) {
        if (data && data.map) {
            const map = data.map;
            vm.treasurePoint.JCObjId = map.profile.JCObjId;
            vm.treasurePoint.JCObjMask = map.profile.JCObjMask;
            vm.treasurePoint.JCRight = map.profile.JCRight;
            vm.treasurePoint.JCBottom = map.profile.JCBottom;
        }
    }

    function onPositionChange(event, data) {
        if (!data.position) { return; }
        const points = data.position.split(',').map(parseFloat);
        if (points.length >= 2) {
            vm.treasurePoint.x = points[0];
            vm.treasurePoint.y = points[1];
        }
    }

    function createTreasurePoint(treasurePoint) {
        TreasurePoint.post(treasurePoint).then(() => {
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
