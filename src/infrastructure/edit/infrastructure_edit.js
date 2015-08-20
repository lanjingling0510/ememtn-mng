require('../../common/service.js');
require('../../exhibition_hall/exhibition_hall.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('InfrastructureEditController', InfrastructureEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.infrastructure-edit', {
        url: '/infrastructures/:infrastructureId',
        template: require('./infrastructure_edit.html'),
        controller: 'InfrastructureEditController as vm',
    });
}

/* @ngInject */
function InfrastructureEditController(AlertService) {

}
