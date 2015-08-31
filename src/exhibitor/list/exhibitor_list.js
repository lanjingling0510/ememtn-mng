require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.list', [
    'ui.router',
    'sanya.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('ExhibitorListController', ExhibitorListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.exhibitor-list', {
        url: '/exhibitors',
        template: require('./exhibitor_list.html'),
        controller: 'ExhibitorListController as vm',
    });
}

/*@ngInject*/
function ExhibitorListController($scope, Restangular) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    vm.query = {
        pageSize: 10,
    };

    $scope.$on('map-change', onFloorChange);

    searchExhibitors(vm.query);

    function searchExhibitors(query) {
        vm.exhibitors = Exhibitor.getList(query).$object;
    }

    function onFloorChange(event, data) {
        vm.floor = data;
    }
}
