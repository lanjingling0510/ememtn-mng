'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.broadcast.service', [
    'ngResource'
]).service('BroadcastService', BroadcastService);

/* @ngInject */
function BroadcastService($resource) {
    let url = '/apis/messages/:messageId';
    return $resource(url, null, { });
}
