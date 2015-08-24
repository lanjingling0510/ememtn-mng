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
function SuggestController(Restangular, AlertService, $scope) {
    let vm = this;
    vm.allChecked = false;
    vm.checkList = [];
    vm.allCheckedChange = allCheckedChange;
    //vm.filterChange = filterChange;
    //vm.deletePosts = deletePosts;


    initController();

    /**
     * @ngdoc   function
     * @desc  �
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
     *  @desc    ��������ʼ������
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
     *  @desc   �ı䵥����ѡ��ļ�������
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
