require('./exhibition_area_list.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-area.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaListController', ExhibitionAreaListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-list', {
        url: '/areas',
        template: require('./exhibition_area_list.html'),
        controller: 'ExhibitionAreaListController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaListController($scope, Restangular) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');

    $scope.$on('map-change', onFloorChange);
    $scope.$on('get-current-map', () => {
        $scope.$broadcast('current-map', vm.floor);
    });
    function searchExhibitionAreas(floor) {
        vm.exhibitionAreas = ExhibitionArea.getList({
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).$object;
    }

    function onFloorChange(event, data) {
        vm.floor = data;
        searchExhibitionAreas(vm.floor);
    }
}
