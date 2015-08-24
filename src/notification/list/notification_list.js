const angular = require('angular');

module.exports = angular.module('ememtn.notification.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
    'common.collapse.directive',
]).config(moduleConfig)
    .controller('NotificationListController', NotificationListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('notification-list', {
        url: '/notifications',
        template: require('./notification_list.html'),
        controller: 'NotificationListController as vm',
    });
}

/* @ngInject*/
function NotificationListController(Restangular, AlertService) {
    const vm = this;
    const Notification = Restangular.all('notifications');
    vm.query = {};

    searchNotifications(vm.query);

    function searchNotifications(query) {
        vm.notifications = Notification.getList(query).$object;
    }
}
