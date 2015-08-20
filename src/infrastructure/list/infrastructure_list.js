require('../../common/service.js');
require('../../exhibition_hall/exhibition_hall.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('InfrastructureListController', InfrastructureListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.infrastructure-list', {
        url: '/infrastructures',
        template: require('./infrastructure_list.html'),
        controller: 'InfrastructureListController as vm',
    });
}

/*@ngInject*/
function InfrastructureListController(AlertService) {

}
