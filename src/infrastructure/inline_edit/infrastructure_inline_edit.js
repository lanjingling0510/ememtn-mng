require('../../common/service.js');
require('../../infrastructure/list/infrastructure_list.js');
const angular = require('angular');

module.exports = angular.module('ememtn.infrastructure.inline-edit', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('InfrastructureInlineEditController', InfrastructureInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.infrastructure-list.infrastructure-inline-edit', {
        url: '/:infrastructureId',
        template: require('./infrastructure_inline_edit.html'),
        controller: 'InfrastructureInlineEditController as vm',
    });
}

/* @ngInject */
function InfrastructureInlineEditController(AlertService) {

}
