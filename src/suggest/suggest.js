"use strict";
let angular = require('angular');

module.exports = angular.module('ememtn.suggest', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('SuggestController', SuggestController);


/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('suggest', {
        url: '/suggest',
        template: require('./suggest.html'),
        controller: 'SuggestController as scope',
    });
}


/* @ngInject */
function SuggestController(Restangular, AlertService) {
    let vm = this;
    vm.allChecked = false;
    vm.checkList = [];
    vm.allCheckedChange = allCheckedChange;
    vm.filterChange = filterChange;
    vm.deletePosts = deletePosts;


    initController();

    /**
     * @ngdoc   function
     * @desc    点击选择全部的多选框
     */
    function allCheckedChange() {
        if (vm.allChecked) {
            vm.suggests.forEach(function (value) {
                value.checked = true;
            });
        } else {
            vm.suggests.forEach(function (value) {
                value.checked = false;
            });
        }
    }


    /**
     *  @ngdoc   function
     *  @desc    控制器初始化函数
     */
    function initController() {
        Restangular.all('suggests').getList().then(function (response) {
            vm.suggests = list;
            vm.suggests.forEach(function (value) {
                value.checked = false;
            });
        }).catch(function (error) {
            AlertService.warning(error.data);
        });
    }

    /**
     *  @ngdoc   $watch
     *  @desc   改变单个复选框的监听程序
     */
    $scope.$watch('scope.suggests', function ($new, $old) {
        let arr;
        if ($new !== $old) {
            arr = vm.suggests.filter(function (item) {
                return item.checked;
            });
            vm.allChecked = arr.length === 0 ? false : true;
        }
    }, true);

}