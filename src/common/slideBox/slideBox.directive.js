"use strict";

require('./slideBox.less');
require('./cyt-turnpage2.js');

let angular = require('angular');
module.exports = angular.module('common.slideBox.directive', [])
    .directive("slideBox", slideBoxDirective)
    .directive("slideBoxPage", slideDirective);

/* @ngInject*/
function slideBoxDirective() {
    let directive = {
        restirct: 'E',
        replace: true,
        transclude: true,
        template: '<div class="slide-box" ng-transclude>' +
        '</div>',
        link: link
    };
    return directive;

    function link($scope, $ele, $attrs) {
        $ele.css('height', $attrs.height+'px');
        $($ele[0]).cyt_turnpage();
        $scope.nextPage = function () {
            $($ele[0]).cyt_turnpage('nextPage');
        };
        $scope.prePage = function () {
            $($ele[0]).cyt_turnpage('prePage');
        };
    }
}


/* @ngInject*/
function slideDirective() {
    let directive = {
        restirct: 'E',
        replace: true,
        transclude: true,
        template: '<div class="slide"  ng-transclude>' +
        '</div>'
    };
    return directive;
}

