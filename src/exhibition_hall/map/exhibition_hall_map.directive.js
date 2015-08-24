const angular = require('angular');
const $ = require('jquery');
const canvas = require('./exhibition_hall_canvas.js');
module.exports = angular.module('ememtn.exhibition_hall.map.directive', [])
    .directive('exhibitionHallMap', mapContainer);


/* @ngInject*/
function mapContainer() {
    let directive;
    const point = {};
    let isMove = false;
    let map;
    let vm;
    directive = {
        restrict: 'AE',
        link: link,
    };
    return directive;

    function link(scope, element) {
        map = $(element[0]);
        map.height(document.documentElement.clientHeight * 0.9);
        canvas.init($('#mapCanvas'), scope);
        vm = scope.vm;
        $(element[0]).on('mousedown', mousedown);
        $(document).on('mousemove', mousemove);
        $(document).on('mouseup', mouseup);
    }
    function mousedown(e) {
        e.preventDefault();
        point.nowX = e.pageX;
        point.nowY = e.pageY;
        isMove = true;
    }

    function mousemove(e) {
        if (!isMove) return;
        e.preventDefault();
        let disX;
        let disY;
        disX = e.pageX - point.nowX;
        disY = e.pageY - point.nowY;
        map.scrollLeft(map.scrollLeft() - disX);
        map.scrollTop(map.scrollTop() - disY);
        point.nowX = e.pageX;
        point.nowY = e.pageY;
    }

    function mouseup() {
        isMove = false;
    }
}
