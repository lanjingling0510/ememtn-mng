'use strict';

/* global AMap*/
require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('InitMap', InitMap);

function InitMap() {
    return function (latitude, longitude) {
        return new AMap.Map("mapContainer", {
            resizeEnable: true,
            view: new AMap.View2D({
                center: new AMap.LngLat(latitude, longitude),
                zoom: 17
            })
        });
    };
}
