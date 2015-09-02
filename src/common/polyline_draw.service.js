/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolylineDraw', PolylineDraw);

/* @ngInject */
function PolylineDraw($q) {
    return function (map, polylineOption) {
        return $q(function (resolve) {
            if (!polylineOption) {
                polylineOption = { // eslint-disable-line no-param-reassign
                    strokeColor: '#FF33FF',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                };
            }
            map.plugin(['AMap.MouseTool'], function () {
                const mouseTool = new AMap.MouseTool(map);
                mouseTool.polyline(polylineOption); //使用鼠标工具绘制圆
                resolve(mouseTool);
            });
        });
    };
}
