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
    const Message = Restangular.all('messages');
    vm.searchMessages = searchMessages;

    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };
    vm.toggleCheckAll = toggleCheckAll;
    vm.removeCheckedMessages = removeCheckedMessages;

    searchMessages(vm.query);

    function searchMessages(query) {
        Message.getList(query).then((messages) => {
            vm.query.total = messages[0];
            vm.messages = messages.slice(1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeCheckedMessages() {
        const msgs = getCheckedMessages();
        const proms = msgs.map(removeMessage);
        $q.all(proms).then(() => {
            AlertService.success('删除完成');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeMessage(msg) {
        return msg.remove().then(() => {
            const index = vm.messages.indexOf(msg);
            vm.messages.splice(index, 1);
            return $q.resolve(true);
        });
    }

    function getCheckedMessages() {
        return vm.messages.filter((msg) => msg._checked);
    }

    function toggleCheckAll(checked) {
        vm.messages.forEach((msg) => {
            msg._checked = checked;
        });
    }
}
