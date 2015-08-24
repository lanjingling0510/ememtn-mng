const angular = require('angular');

module.exports = angular.module('ememtn.message.push', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('MessagePushController', MessagePushController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('message-push', {
        url: '/messages/_push',
        template: require('./message_push.html'),
        controller: 'MessagePushController as vm',
    });
}

/* @ngInject*/
function MessagePushController(Restangular, AlertService) {
    const vm = this;
    const Message = Restangular.all('messages');
    vm.createMessage = createMessage;

    function pushMessage(message) {
        return Message.one(message._id).doPOST({}, 'push');
    }

    function createMessage(message) {
        Message.post(message).then(function (msg) {
            return pushMessage(msg);
        }).then(function () {
            AlertService.success('开始推送');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
