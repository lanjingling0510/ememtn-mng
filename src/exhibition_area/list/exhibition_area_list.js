require('./exhibition_area_list.less');
require('../../common/service.js');
const angular = require('angular');
//const config = require('../../config.json');

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
function ExhibitionAreaListController($scope, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');
    vm.setExhibitionArea = setExhibitionArea;

    $scope.$on('floor-change', onFloorChange);

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

    function setExhibitionArea(exhibitionArea) {
        ExhibitionArea.doPUT(exhibitionArea, vm.map).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
