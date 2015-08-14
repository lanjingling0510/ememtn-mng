'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.treasure_types.service', [
    'ngResource'
]).service('TreasureTypesService', TreasureTypesService);

/* @ngInject */
function TreasureTypesService($resource) {
    let url = '/apis/treasure-types/:treasureTypeId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            param: {
                treasureTypeId: '@_id'
            }
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                treasureTypeId: '@_id'
            }
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                treasureTypeId: '@_id'
            }
        }
    });
}
