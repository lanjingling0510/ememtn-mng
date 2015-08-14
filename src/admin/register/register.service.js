'use strict';

let angular = require('angular');
module.exports = angular.module('sanya.admins.register.service', ['ngResource'])
    .service('RegisterService', RegisterService);

/* @ngInject */
function RegisterService($resource) {
    let url = '/apis/admins';

    return $resource(url, null, {
        register: {
            method: 'post',
            params: {
                username: '@username',
                password: '@password'
            }
        }
    });
}
