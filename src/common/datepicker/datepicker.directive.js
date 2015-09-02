const $ = require('jquery');
/**
 * @ngdoc directive
 * @name datePicker
 * @module 'sanya.common.services'
 * @restrict E
 */
(function () {
    const jqLite = angular.element,
        forEach = angular.forEach;

    angular.module('sanya.common.services')
        .directive('datePicker', IndexDirective);
    //
    function IndexDirective() {
        const obj = {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            template: '<div>' +
            '<input type="text" class="am-form-field" placeholder="日历组件">' +
            '</div>',
            compile: function (element, attr) {
                const input = element.find('input');
                //在作用域没绑定前，修改DOM
                forEach({
                    'ng-model': attr.ngModel,
                }, function (value, name) {
                    input.attr(name, value);
                });
                return function ($scope, $ele) {
                    var input = $ele[0].getElementsByTagName('input')[0];

                    //获得多选框元素的指定控制器实例
                    var ngModelController = jqLite(input).controller('ngModel');

                    //监听多选框的事件
                    $(input).on('changeDate.datepicker.amui', checkbox_change);
                    function checkbox_change(event) {
                        //当触发多选框事件时，改变变量
                        if (ngModelController) {
                            ngModelController.$setViewValue(event.date);
                            $scope.$apply();
                        }
                    }
                };
            }
        };

        return obj;
    }
})();
