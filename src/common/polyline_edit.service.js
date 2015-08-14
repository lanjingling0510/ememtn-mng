'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('PolylineEdit', PolylineEdit);

/* @ngInject */
function PolylineEdit($q) {
    return function(map, polyline) {
        return $q(function(resolve) {
            map.plugin(["AMap.PolyEditor"], function() {
                let editorTool = new AMap.PolyEditor(map, polyline);
                editorTool.open();
                resolve(editorTool);
            });
        });
    };
}
