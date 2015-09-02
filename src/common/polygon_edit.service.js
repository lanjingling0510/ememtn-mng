/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolygonEdit', PolygonEdit);

/* @ngInject */
function PolygonEdit($q) {
    return function (map, polygon) {
        return $q(function (resolve) {
            map.plugin(['AMap.PolyEditor'], function () {
                const editorTool = new AMap.PolyEditor(map, polygon);
                editorTool.open();
                resolve(editorTool);
            });
        });
    };
}
