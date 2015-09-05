require('./exhibition_area_batch.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-area.batch', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaBatchController', ExhibitionAreaBatchController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-batch', {
        url: '/area_batch',
        template: require('./exhibition_area_batch.html'),
        controller: 'ExhibitionAreaBatchController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaBatchController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');
    const MapFeature = Restangular.all('map-features');
    vm.searchExhibitionAreas = searchExhibitionAreas;
    vm.removeSelectedExhibitionAreas = removeSelectedExhibitionAreas;
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };

    $scope.$on('map-change', onFloorChange);
    $scope.$on('current-map', onFloorChange);
    $scope.$emit('get-current-map');

    let searchTimer;
    function searchExhibitionAreas(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        $timeout(() => {
            ExhibitionArea.getList(query).then((exhibitionAreas) => {
                vm.query.total = exhibitionAreas[0];
                vm.exhibitionAreas = exhibitionAreas.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function onFloorChange(event, data) {
        const map = data.map.profile || data.map;
        vm.query.JCObjId = map.JCObjId;
        vm.query.JCObjMask = map.JCObjMask;
        searchExhibitionAreas(vm.query);
    }

    function getSelectedAreas() {
        return vm.exhibitionAreas.filter((area) => area._checked);
    }

    function removeExhibitionArea(exhibitionArea) {
        console.log(exhibitionArea);
        MapFeature.remove(exhibitionArea).then(() => {
            return exhibitionArea.remove();
        }).then(() => {
            const index = vm.exhibitionAreas.indexOf(exhibitionArea);
            vm.exhibitionAreas.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeSelectedExhibitionAreas() {
        const selectedExhibitionAreas = getSelectedAreas();
        selectedExhibitionAreas.forEach(removeExhibitionArea);
    }
}
