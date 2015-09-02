const angular = require('angular');
module.exports = angular.module('ememtn.admins.register.service', ['ngResource'])
    .service('RegisterService', RegisterService);

/* @ngInject */
function RegisterService($resource) {
    const url = '/apis/admins';

    return $resource(url, null, {
        register: {
            method: 'post',
            params: {
                username: '@username',
                password: '@password',
            },
        },
    });
}
