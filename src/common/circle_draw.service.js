/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('CircleDraw', CircleDraw);

/* @ngInject */
function CircleDraw($q) {
    return function (map, circleOption) {
        return $q(function (resolve) {
            if (!circleOption) {
                circleOption = { // eslint-disable-line no-param-reassign
                    strokeColor: '#FF33FF',
                    fillColor: '#FF99FF',
                    fillOpacity: 0.5,
                    strokeOpacity: 1,
                    strokeWeight: 2,
                };
            }

            map.plugin(['AMap.MouseTool'], function () {
                const mouseTool = new AMap.MouseTool(map);
                mouseTool.circle(circleOption); //使用鼠标工具绘制圆
                resolve(mouseTool);
            });
        });
    };
}
