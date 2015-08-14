'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.groups.service', [
    'ngResource'
]).service('GroupsService', GroupsService);

/* @ngInject */
function GroupsService($resource) {
    let url = '/apis/groups/:groupId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                groupId: '@_id'
            }
        }
    });
}
