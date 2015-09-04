require('../../common/service.js');
require('../list/exhibitor_list.js');
const angular = require('angular');
const modalTemplate = require('./modal.html');

module.exports = angular.module('ememtn.exhibitor.inline-edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitorInlineEditController', ExhibitorInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual.exhibitor-list.exhibitor-inline-edit', {
        url: '/:exhibitorId',
        template: require('./exhibitor_inline_edit.html'),
        controller: 'ExhibitorInlineEditController as vm',
    });
}


/* @ngInject */
function ExhibitorInlineEditController(Restangular, $stateParams, commonModal, $scope) {
    const vm = this;
    vm.exhibitor = Restangular.one('exhibitors', $stateParams.exhibitorId).get().$object;
    commonModal.fromTemplateUrl(modalTemplate, {scope: $scope}).then(function (modal) {
        vm.modal = modal;
        vm.modal.show();
    });
}
