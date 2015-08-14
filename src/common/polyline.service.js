'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('PolylineTool', PolylineTool);

/* @ngInject */
function PolylineTool(PolylineDraw, PolylineEdit) {
    return {
        draw: PolylineDraw,
        edit: PolylineEdit
    };
}
