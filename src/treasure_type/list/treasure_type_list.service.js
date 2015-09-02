const angular = require('angular');

module.exports = angular.module('ememtn.treasure_type.list.service', [
    'ngResource',
]).service('TreasureTypesService', TreasureTypesService);

/* @ngInject */
function TreasureTypesService($resource) {
    const url = '/apis/treasure-types/:treasureTypeId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            param: {
                treasureTypeId: '@_id',
            },
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                treasureTypeId: '@_id',
            },
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                treasureTypeId: '@_id',
            },
        },
    });
}
