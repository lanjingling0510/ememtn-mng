require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.list', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('ExhibitorListController', ExhibitorListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual.exhibitor-list', {
        url: '/exhibitors',
        template: require('./exhibitor_list.html'),
        controller: 'ExhibitorListController as vm',
    });
}

/*@ngInject*/
function ExhibitorListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    vm.searchExhibitors = searchExhibitors;
    vm.query = {
        page: 1,
        pageSize: 12,
        total: 0,
    };

    $scope.$on('map-change', onFloorChange);

    searchExhibitors(vm.query, 0);

    let searchTimer;
    function searchExhibitors(query={}, delay=200) {
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

    function onFloorChange(event, data) {
        vm.floor = data;
        vm.query.JCObjId = data.map.profile.JCObjId;
        vm.query.JCObjMask = data.map.profile.JCObjMask;
        searchExhibitors(vm.query, 0);
    }
}
