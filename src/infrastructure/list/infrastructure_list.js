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
function InfrastructureListController($scope, Restangular, AlertService) {
    const vm = this;
    const Infrastructure = Restangular.all('infrastructures');

    $scope.$on('area-change', onAreaChange);

    function onAreaChange(event, data) {
        const exhibitionArea = data;
        vm.infrastructures = Infrastructure.getList({
            areaId: exhibitionArea._id,
        }).$object;
    }
}
