require('../../common/service.js');
require('../list/exhibitor_list.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.inline-edit', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('ExhibitorInlineEditController', ExhibitorInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.exhibitor-list.exhibitor-inline-edit', {
        url: '/:exhibitorId',
        template: require('./exhibitor_inline_edit.html'),
        controller: 'ExhibitorInlineEditController as vm',
    });
}


/* @ngInject */
function ExhibitorInlineEditController(Restangular, $stateParams, AlertService) {
    const vm = this;
    vm.exhibitor = Restangular.one('exhibitors', $stateParams.exhibitorId).get().$object;
}
