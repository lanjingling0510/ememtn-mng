const angular = require('angular');
const $ = require('jquery');
const canvas = require('./pavilion_canvas.js');
module.exports = angular.module('ememtn.pavilion.map.directive', [])
    .directive('pavilionMap', PavilionMap);


/* @ngInject*/
function PavilionMap() {
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
        vm = scope.vm;
        vm.positionStr = '';
        vm.clearPolygons = clearPolygons;
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
        map.css('cursor', 'pointer');
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
        map.css('cursor', 'auto');
    }

    function clearPolygons() {
        canvas.clearPolygons();
        vm.positionStr = '';
    }
}
