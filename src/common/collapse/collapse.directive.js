"use strict";


require('./collapse.less');
let angular = require('angular');
module.exports = angular.module('common.collapse.directive', [])
    .directive('myCollapse', collapseDirective);


/* @ngInject*/
function collapseDirective() {
    let directive = {
        restirct: 'E',
        replace: true,
        scope: {
            content: '@',
        },
        template: '<div class="am-panel">' +
        '<div class="am-panel-hd" ng-transclude></div>' +
        '<div class="am-panel-collapse am-collapse">' +
        '<div class="am-panel-bd">{{content}}</div>' +
        '</div>' +
        '</div>',
        transclude: true,
        link: link,
    };
    return directive;

    function link($scope, $ele) {
        let open = false;
        const arrow = $($ele[0].querySelector('.am-icon-sort-desc'));
        arrow.on('click', function () {
            open = ! open;
            $($ele[0].querySelector('.am-collapse')).collapse('toggle');
            if (open) {
                arrow.css('transform', 'rotate(180deg)');
            } else {
                arrow.css('transform', 'rotate(0)');
            }
        });
    }
}