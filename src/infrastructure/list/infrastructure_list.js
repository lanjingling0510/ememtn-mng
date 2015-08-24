require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('InfrastructureListController', InfrastructureListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.infrastructure-list', {
        url: '/infrastructures',
        template: require('./infrastructure_list.html'),
        controller: 'InfrastructureListController as vm',
    });
}

/*@ngInject*/
function InfrastructureListController(AlertService) {

}
