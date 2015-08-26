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
function NotificationListController($q, Restangular, AlertService) {
    const vm = this;
    const Notification = Restangular.all('notifications');
    vm.query = {};
    vm.repushCheckedNotifications = repushCheckedNotifications;
    vm.removeCheckedNofitications = removeCheckedNofitications;
    vm.toggleCheckAll = toggleCheckAll;

    searchNotifications(vm.query);

    function searchNotifications(query) {
        vm.notifications = Notification.getList(query).$object;
    }

    function repushCheckedNotifications() {
        const notis = getCheckedNotifications();
        const proms = notis.map(pushNotification);
        $q.all(proms).then(() => {
            AlertService.success('开始推送');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeCheckedNofitications() {
        const notis = getCheckedNotifications();
        const proms = notis.map(removeNotification);
        $q.all(proms).then(() => {
            AlertService.success('删除完成');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeNotification(noti) {
        return noti.remove().then(() => {
            const index = vm.notifications.indexOf(noti);
            vm.notifications.splice(index, 1);
            return $q.resolve(true);
        });
    }

    function pushNotification(notification) {
        return notification.all('push').post();
    }

    function getCheckedNotifications() {
        return vm.notifications.filter((noti) => noti._checked);
    }

    function toggleCheckAll(checked) {
        vm.notifications.forEach((noti) => {
            noti._checked = checked;
        });
    }
}
