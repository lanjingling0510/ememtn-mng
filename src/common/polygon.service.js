require('./common.service.js');
require('./polygon_draw.service.js');
require('./polygon_edit.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolygonTool', PolygonTool);

/* @ngInject */
function PolygonTool(PolygonDraw, PolygonEdit) {
    return {
        draw: PolygonDraw,
        edit: PolygonEdit,
    };
}
