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
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {};
    vm.exhibition = {
        startAt: new Date(),
        endAt: new Date(),
    };
    vm.createExhibition = createExhibition;

    function pushExhibition(exhibition) {
        return Exhibition.one(exhibition._id).doPOST({}, 'push');
    }

    function createExhibition(exhibition) {
        Exhibition.post(exhibition).then(function (exh) {
            return pushExhibition(exh);
        }).then(function () {
            AlertService.success('开始推送');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
