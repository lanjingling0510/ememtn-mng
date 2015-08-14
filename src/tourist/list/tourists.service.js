'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.tourists.service', [
    'ngResource'
]).service('TouristsService', TouristsService);

/* @ngInject */
function TouristsService($resource) {
    let url = '/apis/tourists/:touristId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                touristId: '@_id'
            }
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                touristId: '@_id'
            }
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                touristId: '@_id'
            }
        }
    });
}
