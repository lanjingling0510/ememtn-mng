require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('sanya.beacon.create', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('InfrastructureCreateController', InfrastructureCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.infrastructure-create', {
        url: '/infrastructures/new',
        template: require('./infrastructure_create.html'),
        controller: 'InfrastructureCreateController as vm',
    });
}

/* @ngInject */
function InfrastructureCreateController(AlertService) {

}
