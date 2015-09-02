/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('CircleEdit', CircleEdit);

/* @ngInject */
function CircleEdit($q) {
    return function (map, circle) {
        return $q(function (resolve, reject) {
            try {
                map.plugin(['AMap.CircleEditor'], function () {
                    const editorTool = new AMap.CircleEditor(map, circle);
                    editorTool.open();
                    resolve(editorTool);
                });
            } catch (e) {
                reject(e);
            }
        });
    };
}
