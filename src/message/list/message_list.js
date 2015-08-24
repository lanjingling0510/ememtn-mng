const angular = require('angular');

module.exports = angular.module('ememtn.message.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
    'common.collapse.directive',
]).config(moduleConfig)
    .controller('MessageListController', MessageListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('message-list', {
        url: '/messages',
        template: require('./message_list.html'),
        controller: 'MessageListController as vm',
    });
}

/* @ngInject*/
function MessageListController(Restangular, AlertService) {
    const vm = this;
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {};

    searchExhibitions(vm.query);

    function searchExhibitions(query) {
        vm.exhibitions = Exhibition.getList(query).$object;
    }
}
