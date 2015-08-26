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
function ExhibitionAreaListController($scope, $state, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');
    vm.editMode = editMode;

    $scope.$on('floor-change', onFloorChange);

    vm.exhibitionAreas = [
        {
            _id: 'areaid 1',
            name: 'area 1 name',
        },
        {
            _id: 'areaid 2',
            name: 'area 2 name',
        },
        {
            _id: 'areaid 3',
            name: 'area 3 name',
        },
        {
            _id: 'areaid 4',
            name: 'area 4 name',
        },
    ];


    function fetchExhibitionAreas(map) {
        vm.exhibitionAreas = ExhibitionArea.getList({
            JCObjId: map.JCObjId,
            JCObjMask: map.JCObjMask,
        }).$object;
    }

    function onFloorChange(event, data) {
        vm.map = data;
        fetchExhibitionAreas(vm.map);
    }

    function editMode(exhibitionArea) {
        $state.go('exhibition-hall-map.exhibition-area-list.exhibition-area-inline-edit', {
            exhibitionAreaId: exhibitionArea._id,
        });
    }
}
