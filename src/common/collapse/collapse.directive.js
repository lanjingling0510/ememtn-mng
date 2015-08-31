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

    function link($scope, $ele, $attr) {
        let open = false;
        const arrow = $($ele[0].querySelector('.am-icon-sort-desc'));
        if ($attr.scale) {
            const panelHead = $ele[0].querySelector('.am-panel-hd ul');
            const scaleList = $attr.scale.split(',');
            [].forEach.call(panelHead.children, function (value, index) {
                value.style.flex = scaleList[index] || 0;
            });
        }

        arrow.on('click', function () {
            open = !open;
            $($ele[0].querySelector('.am-collapse')).collapse('toggle');
            if (open) {
                arrow.css('transform', 'rotate(180deg)');
            } else {
                arrow.css('transform', 'rotate(0)');
            }
        });
    }
}
