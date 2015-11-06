require('../../common/service.js');
require('../../treasure_area/virtual/treasure_area_virtual.js');
require('../../_directives/emei_map');
require('../../_directives/floor_button_group');
const config = require('../../config.json');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.list', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasure-area.virtual',
    'jc.emei.map.directive',
    'jc.directive.floor-button-group',
]).config(moduleConfig)
    .controller('ExhibitorListController', ExhibitorListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-list', {
        url: '/exhibitors',
        template: require('./exhibitor_list.html'),
        controller: 'ExhibitorListController as vm',
    });
}

/* @ngInject */
function ExhibitorListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    vm.searchExhibitors = searchExhibitors;
    vm.onDrawEnd = onDrawEnd;
    vm.onFloorChange = onFloorChange;
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };

    $scope.$on('exhibitor-change', onExhibitorChange);

    searchExhibitors(vm.query, 0);

    let searchTimer;
    function searchExhibitors(query = {}, delay = 200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            Exhibitor.getList(query).then((exhibitors) => {
                vm.query.total = exhibitors[0];
                vm.exhibitors = exhibitors.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function onFloorChange(floor) {
        vm.floor = floor;
        vm.query.JCObjId = floor.JCObjId;
        vm.query.JCObjMask = floor.JCObjMask;
        searchExhibitors(vm.query, 0);
    }

    function onExhibitorChange() {
        searchExhibitors(vm.query);
    }

    function onDrawEnd(coordinates) {
        console.log(coordinates);
    }
}
