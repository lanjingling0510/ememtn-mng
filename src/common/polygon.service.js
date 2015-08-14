'use strict';

require('./common.service.js');
require('./polygon_draw.service.js');
require('./polygon_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('PolygonTool', PolygonTool);

/* @ngInject */
function PolygonTool(PolygonDraw, PolygonEdit) {
    return {
        draw: PolygonDraw,
        edit: PolygonEdit
    };
}
