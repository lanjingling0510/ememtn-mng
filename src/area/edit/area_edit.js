'use strict';
/* global AMap */

require('../../common/service.js');
require('./area_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.area_edit', [
    'ui.router',
    'sanya.common.services',
    'sanya.area_edit.service'
]).config(moduleConfig)
    .controller('AreaEditController', AreaEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi.area_edit', {
        url: '/areas/:areaId',
        template: require('./area_edit.html'),
        controller: 'AreaEditController as scope'
    });
}

/* @ngInject */
function AreaEditController() {
    // body...
}
