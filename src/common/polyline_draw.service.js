'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('PolylineDraw', PolylineDraw);

/* @ngInject */
function PolylineDraw($q) {
    return function(map, polylineOption) {
        return $q(function(resolve) {
            if (!polylineOption) {
                polylineOption = {
                    strokeColor: "#FF33FF",
                    strokeOpacity: 1,
                    strokeWeight: 2
                };
            }
            map.plugin(["AMap.MouseTool"], function() {
                let mouseTool = new AMap.MouseTool(map);
                mouseTool.polyline(polylineOption); //使用鼠标工具绘制圆
                resolve(mouseTool);
            });
        });
    };
}
