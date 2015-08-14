'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('CircleEdit', CircleEdit);

/* @ngInject */
function CircleEdit($q) {
    return function(map, circle) {
        return $q(function(resolve, reject) {
            try {
                map.plugin(["AMap.CircleEditor"], function() {
                    let editorTool = new AMap.CircleEditor(map, circle);
                    editorTool.open();
                    resolve(editorTool);
                });
            } catch (e) {
                reject(e);
            }
        });
    };
}
