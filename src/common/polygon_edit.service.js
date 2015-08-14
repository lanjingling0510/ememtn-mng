'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('PolygonEdit', PolygonEdit);

/* @ngInject */
function PolygonEdit($q) {
    return function(map, polygon) {
        return $q(function(resolve) {
            map.plugin(["AMap.PolyEditor"], function() {
                let editorTool = new AMap.PolyEditor(map, polygon);
                editorTool.open();
                resolve(editorTool);
            });
        });
    };
}
