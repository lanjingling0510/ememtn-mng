'use strict';

require('./common.service.js');
require('./circle_draw.service.js');
require('./circle_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('CircleTool', CircleTool);

/* @ngInject */
function CircleTool(CircleDraw, CircleEdit) {
    return {
        draw: CircleDraw,
        edit: CircleEdit
    };
}
