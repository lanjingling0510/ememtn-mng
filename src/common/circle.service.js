require('./common.service.js');
require('./circle_draw.service.js');
require('./circle_edit.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('CircleTool', CircleTool);

/* @ngInject */
function CircleTool(CircleDraw, CircleEdit) {
    return {
        draw: CircleDraw,
        edit: CircleEdit,
    };
}
