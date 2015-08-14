'use strict';

require('./login.less');
let angular = require('angular');
require('./login.service.js');

module.exports = angular.module('sanya.login', [
    'ui.router',
    'angular-storage',
    'sanya.common.services',
    'sanya.login.service'
]).config(moduleConfig)
    .controller('LoginController', LoginController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        template: require('./login.html'),
        controller: 'LoginController as scope'
    });
}

/* @ngInject */
function LoginController($rootScope, $location, store, LoginService, AlertService, $state) {
    let vm = this;
    vm.login = login;

    initController();

    function login(admin) {
        LoginService.getToken(admin).$promise
            .then(function (res) {
                let token = res.access_token;
                store.set('auth.accessToken', token);
                if (!$rootScope.auth) { $rootScope.auth = {}; }
                $rootScope.auth.accessToken = token;
                return LoginService.getProfile().$promise;
            }).then(function (profile) {
                store.set('auth.profile', profile);
                $rootScope.auth.profile = profile;

                $state.go('home');
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    }

    function initController() {
        vm.admin = {
            username: 'root',
            password: 'rootroot'
        };
    }
}
