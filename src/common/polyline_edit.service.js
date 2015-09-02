/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('PolylineEdit', PolylineEdit);

/* @ngInject */
function PolylineEdit($q) {
    return function (map, polyline) {
        return $q(function (resolve) {
            map.plugin(['AMap.PolyEditor'], function () {
                const editorTool = new AMap.PolyEditor(map, polyline);
                editorTool.open();
                resolve(editorTool);
            });
        });
    };
}
