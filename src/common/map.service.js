'use strict';

require('./common.service.js');
require('./initmap.service.js');
require('./circle.service.js');
require('./polyline.service.js');
require('./polygon.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('MapTool', MapTool);

/* @ngInject */
function MapTool(InitMap, CircleTool, PolylineTool, PolygonTool) {
    return {
        initMap: InitMap,
        circle: CircleTool,
        polyline: PolylineTool,
        polygon: PolygonTool
    };
}
