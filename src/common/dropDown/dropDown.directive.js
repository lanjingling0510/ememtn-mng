let angular = require('angular');
module.exports = angular.module('common.dropDown.directive', [])
    .directive('dropDown', dropDownDirective);


/* @ngInject*/
function dropDownDirective() {
    let directive = {
        restirct: 'E',
        replace: true,
        scope: {
            title: '@',
        },
        transclude: true,
        template: '<div class="am-dropdown">' +
        '<button class="am-btn am-dropdown-toggle">{{title}} <span class="am-icon-caret-down"></span></button>' +
        '<div class="am-dropdown-content" ng-transclude>' +
        '</div>' +
        '</div>',
        link: link,
    };
    return directive;

    function link($scope, $ele, $attrs) {
        $ele.children()[0].classList.add($attrs.toggle);
        $($ele[0]).dropdown({});
    }
}