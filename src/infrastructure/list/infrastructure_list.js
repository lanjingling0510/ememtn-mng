require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.list', [
    'ui.router',
    'sanya.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('InfrastructureListController', InfrastructureListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.infrastructure-list', {
        url: '/infrastructures',
        template: require('./infrastructure_list.html'),
        controller: 'InfrastructureListController as vm',
    });
}

/*@ngInject*/
function InfrastructureListController($scope, $state, Restangular, AlertService) {
    const vm = this;
    const Infrastructure = Restangular.all('infrastructures');
    vm.editMode = editMode;

    $scope.$on('area-change', onAreaChange);

    /* fake data */
    vm.infrastructures = [
        { name: 'inf1', _id: 1 },
        { name: 'inf2', _id: 2 },
        { name: 'inf3', _id: 3 },
        { name: 'inf4', _id: 4 },
        { name: 'inf5', _id: 5 },
        { name: 'inf6', _id: 6 },
    ];

    function fetchInfrastructures(exhibitionArea) {
        vm.infrastructures = Infrastructure.getList({
            areaId: exhibitionArea._id,
        }).$object;
    }

    function onAreaChange(event, data) {
        const exhibitionArea = data;
        // fetchInfrastructures(exhibitionArea);
    }


    function editMode(infrastructure) {
        $state.go('exhibition-hall-map.exhibition-area-virtual.infrastructure-list.infrastructure-inline-edit', {
            infrastructureId: infrastructure.name,
        });
    }
}
