'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.area_edit.service', [
    'ngResource'
]).service('AreaEditService', AreaEditService);

/* @ngInject */
function AreaEditService($resource) {
    let url = '/apis/areas/:areaId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                areaId: '@_id'
            }
        }
    });
}
