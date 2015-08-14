'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.areas_list.service', [
    'ngResource'
]).service('AreasListService', AreasListService);

/* @ngInject */
function AreasListService($resource) {
    const url = '/apis/areas/:areaId';
    return $resource(url, null, {
        disable: {
            url: url + '/disablement',
            method: 'PUT',
            params: {
                areaId: '@_id'
            }
        },
        enable: {
            url: url + '/enablement',
            method: 'PUT',
            params: {
                areaId: '@_id'
            }
        },
        remove: {
            method: 'DELETE',
            params: {
                areaId: '@_id'
            }
        }
    });
}
