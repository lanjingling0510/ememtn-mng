'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.area_create.service', [
    'ngResource'
]).service('AreaCreateService', AreaCreateService);

/* @ngInject */
function AreaCreateService($resource) {
    let url = '/apis/areas/:areaId';
    return $resource(url, null, { });
}
