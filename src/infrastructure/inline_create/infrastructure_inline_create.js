require('../../common/service.js');
require('../../infrastructure/list/infrastructure_list.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.inline-create', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('InfrastructureInlineCreateController', InfrastructureInlineCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.infrastructure-list.infrastructure-inline-create', {
        url: '/_create',
        template: require('./infrastructure_inline_create.html'),
        controller: 'InfrastructureInlineCreateController as vm',
    });
}

/* @ngInject */
function InfrastructureInlineCreateController(AlertService) {

}
