/**
 * @ngdoc   directive
 * @name    dropDown
 * @module  common.dropDown.directive
 * @example
 * ````````````````````````````````````````````
  <drop-down title="操作" toggle="am-btn-danger" class="am-margin-left">
    <button class="am-btn am-btn-block">显示</button>
    <button class="am-btn am-btn-block">隐藏</button>
    <button class="am-btn am-btn-block">顶</button>
    <button class="am-btn am-btn-block">删除</button>
  </drop-down>
 *
 */


const angular = require('angular');
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
        template: '<div class="am-dropdown am-block">' +
        '<button class="btn btn-danger am-dropdown-toggle am-padding-horizontal-lg">{{title}} <span class="am-icon-caret-down"></span></button>' +
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
