'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.admins.service', ['ngResource'])
    .service('AdminService', AdminService);

/* @ngInject */
function AdminService($resource) {
    let url = '/apis/admins/:adminId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                adminId: '@_id'
            }
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                adminId: '@_id'
            }
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                adminId: '@_id'
            }
        }
    });
}
