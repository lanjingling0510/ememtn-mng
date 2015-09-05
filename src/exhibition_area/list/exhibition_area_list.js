require('./exhibition_area_list.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-area.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaListController', ExhibitionAreaListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-list', {
        url: '/areas',
        template: require('./exhibition_area_list.html'),
        controller: 'ExhibitionAreaListController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');
    vm.searchExhibitionAreas = searchExhibitionAreas;
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
        console.log(map);
        vm.query.JCObjId = map.JCObjId;
        vm.query.JCObjMask = map.JCObjMask;
        searchExhibitionAreas(vm.query);
    }
}
