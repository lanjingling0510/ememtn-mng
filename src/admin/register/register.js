'use strict';

let angular = require('angular');
require('./register.service.js');

module.exports = angular.module('sanya.admins.register', [
    'ui.router',
    'sanya.admins.register.service'
]).config(moduleConfig)
    .controller('registerController', registerController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('admin_register', {
        url: '/admins/register',
        template: require('./register.html'),
        controller: 'registerController as scope'
    });
}

/* @ngInject */
function registerController(RegisterService, AlertService) {
    let scope = this;
    scope.registerClick = registerClick;

    initController();

    function registerClick(user) {
        RegisterService.register(user).$promise
        .then(function() {
            AlertService.success('注册成功！');
        }).catch(function(err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        scope.user = { };
    }
}
