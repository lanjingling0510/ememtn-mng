require('./exhibition_area_virtual.less');
require('../../common/service.js');
require('../../pavilion/map/pavilion_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-area.virtual', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.pavilion.map',
]).config(moduleConfig)
    .controller('ExhibitionAreaVirtualController', ExhibitionAreaVirtualController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual', {
        url: '/virtual-areas',
        template: require('./exhibition_area_virtual.html'),
        controller: 'ExhibitionAreaVirtualController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaVirtualController($scope, Restangular, AlertService) {
    const vm = this;
    vm.onAreaChange = onAreaChange;

    $scope.$on('map-change', onMapChange);
    $scope.$on('current-map', onMapChange);
    $scope.$emit('get-current-map');

    function fetchExhibitionVirtualAreas(map) {
        Restangular.all('exhibition-areas').getList({
            JCObjId: map.JCObjId,
            JCObjMask: map.JCObjMask,
        }).then(function (exhibitionAreas) {
            vm.exhibitionAreas = exhibitionAreas;
            vm.exhibitionArea = exhibitionAreas[0];
            onAreaChange(vm.exhibitionArea);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function onMapChange(event, data) {
        const map = data;
        fetchExhibitionVirtualAreas(map);
    }

    function onAreaChange(exhibitionArea) {
        $scope.$broadcast('area-change', {
            exhibitionArea: exhibitionArea,
        });
    }
}
