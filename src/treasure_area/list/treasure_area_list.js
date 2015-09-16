require('./treasure_area_list.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-area.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaListController', ExhibitionAreaListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.treasure-area-list', {
        url: '/areas',
        template: require('./treasure_area_list.html'),
        controller: 'ExhibitionAreaListController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('treasure-areas');
    vm.searchExhibitionAreas = searchExhibitionAreas;
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };

    $scope.$on('map-change', onFloorChange);
    $scope.$on('current-map', onFloorChange);
    $scope.$on('treasure-area-change', onExhibitionAreaChange);
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
        if (data && data.map) {
            const map = data.map;
            vm.query.JCObjId = map.profile.JCObjId;
            vm.query.JCObjMask = map.profile.JCObjMask;
            searchExhibitionAreas(vm.query);
        }
    }

    function onExhibitionAreaChange() {
        console.log('=========');
        searchExhibitionAreas(vm.query, 0);
    }
}
