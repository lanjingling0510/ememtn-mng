/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolygonDraw', PolygonDraw);

/* @ngInject */
function PolygonDraw($q) {
    return function (map, polygonOption) {
        return $q(function (resolve) {
            if (!polygonOption) {
                polygonOption = { // eslint-disable-line no-param-reassign
                    strokeColor: '#FF33FF',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                };
            }

            //在地图中添加MouseTool插件
            map.plugin(['AMap.MouseTool'], function () {
                const mouseTool = new AMap.MouseTool(map);
                mouseTool.polygon(polygonOption); //使用鼠标工具绘制多边形
                resolve(mouseTool);
            });
        });
    };
}
