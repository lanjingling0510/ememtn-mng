/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolylineTool', PolylineTool);

/* @ngInject */
function PolylineTool(PolylineDraw, PolylineEdit) {
    return {
        draw: PolylineDraw,
        edit: PolylineEdit,
    };
}
