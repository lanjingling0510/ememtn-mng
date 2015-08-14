'use strict';

require('../common/service.js');
require('./broadcast.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.broadcast', [
    'ui.router',
    'sanya.common.services',
    'sanya.broadcast.service'
]).config(moduleConfig)
    .controller('BroadcastController', BroadcastController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('broadcast', {
        url: '/broadcast',
        template: require('./broadcast.html'),
        controller: 'BroadcastController as scope'
    });
}

/*@ngInject*/
function BroadcastController($stateParams, BroadcastService, AlertService) {
    let vm = this;

    vm.broadcastMessage = function broadcastMessage(message) {
        BroadcastService.save(message).$promise
        .then(function () {
            vm.message.createdAt = Date.now();
            vm.messages.push(vm.message);
            vm.message = {
                type: 'system'
            };
            AlertService.success('发送成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        vm.message = {
            type: 'system'
        };

        BroadcastService.query().$promise
        .then(function (messages) {
            vm.messages = messages;
        });
    }());
}
