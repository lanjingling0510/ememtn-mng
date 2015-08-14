'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.prize_types.service', [
    'ngResource'
]).service('PrizeTypesService', PrizeTypesService);

/* @ngInject */
function PrizeTypesService($resource) {
    let url = '/apis/prize-types/:prizeTypeId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                prizeTypeId: '@_id'
            }
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                prizeTypeId: '@_id'
            }
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                prizeTypeId: '@_id'
            }
        }
    });
}
