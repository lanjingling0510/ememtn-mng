const angular = require('angular');

module.exports = angular.module('ememtn.notification.push', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('NotificationPushController', NotificationPushController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('notification-push', {
        url: '/notifications/_push',
        template: require('./notification_push.html'),
        controller: 'NotificationPushController as vm',
    });
}

/* @ngInject*/
function NotificationPushController(Restangular, AlertService) {
    const vm = this;
    const Notification = Restangular.all('notifications');
    vm.createNotification = createNotification;

    function pushNotification(notification) {
        return Notification.one(notification._id).all('push').post();
    }

    function createNotification(notification) {
        Notification.post(notification).then(function (msg) {
            return pushNotification(msg);
        }).then(function () {
            AlertService.success('开始推送');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
