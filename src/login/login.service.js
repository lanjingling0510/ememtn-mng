'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.login.service', [
    'ngResource'
]).service('LoginService', LoginService);

/* @ngInject */
function LoginService($resource, $rootScope, store, $state) {
    let url = '/apis/auth';

    let authObj = $resource(url, null, {
        getToken: {
            url: url + '/token',
            method: 'POST'
        },
        getProfile: {
            url: url + '/profile',
            method: 'GET'
        },
        logout: {
            url: url
        }
    });
    authObj.logout = logout;
    // return {
    //     getToken: getToken,
    //     getProfile: getProfile,
    //     logout: logout
    // };
    return authObj;

    // function getToken(username, password) {
    //     let url = '/apis/auth/token';
    //     let data = {
    //         username: username,
    //         password: password
    //     };
    //
    //     return $http.post(url, data);
    // }

    // function getProfile(accessToken) {
    //     let url = '/apis/auth/profile';
    //     let conf = {
    //         headers: {
    //             'Authorization': 'Bearer ' + accessToken
    //         }
    //     };
    //     return $http.get(url, conf);
    // }

    function logout() {
        delete $rootScope.auth;

        store.remove('auth.profile');
        store.remove('auth.accessToken');

        // $location.path('/login');
        $state.go('login');
    }
}
