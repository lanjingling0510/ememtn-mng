'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.beacons.service', [
    'ngResource'
]).service('BeaconsService', BeaconsService);

/* @ngInject */
function BeaconsService($resource) {
    let url = '/apis/beacons/:beaconId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                beaconId: '@_id'
            }
        }
    });
}
