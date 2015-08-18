"use strict";
let angular = require('angular');

module.exports = angular.module('ememtn.news', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('NewsController', NewsController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('news', {
        url: '/news',
        template: require('./news.html'),
        controller: 'NewsController as scope',
    });
}

/* @ngInject */
function NewsController(Restangular, AlertService, $scope) {

    let list = [
        {
            _id: '1', // 新闻Id
            adminId: 'news userId', // 发布新闻的管理员Id
            subject: 'news subject', // 新闻主题
            content: 'news content', // 新闻内容
            pictures: [// 新闻相关图片Url
                'http://example.com/newsa/pic1.jpg',
                'http://example.com/newsa/pic2.png',
                // ...
            ],
            visiable: 1, // 表示新闻未被管理员隐藏，
            sticky: 1, // 0表示不置顶，1表示置顶，按照数组顺序显示即可
            stickedAt: 'ytbuhnim', // 置顶时间
            createdAt: 'tyghunmj', // 新闻发布时间
            updatedAt: 'tygbhunjm' // 新闻更新时间
        },
        {
            _id: '2', // 新闻Id
            adminId: 'news userId', // 发布新闻的管理员Id
            subject: 'news subject', // 新闻主题
            content: 'news content', // 新闻内容
            pictures: [// 新闻相关图片Url
                'http://example.com/newsa/pic1.jpg',
                'http://example.com/newsa/pic2.png',
                // ...
            ],
            visiable: 1, // 表示新闻未被管理员隐藏，
            sticky: 1, // 0表示不置顶，1表示置顶，按照数组顺序显示即可
            stickedAt: 'ytbuhnim', // 置顶时间
            createdAt: 'tyghunmj', // 新闻发布时间
            updatedAt: 'tygbhunjm' // 新闻更新时间
        },
        {
            _id: '3', // 新闻Id
            adminId: 'news userId', // 发布新闻的管理员Id
            subject: 'news subject', // 新闻主题
            content: 'news content', // 新闻内容
            pictures: [// 新闻相关图片Url
                'http://example.com/newsa/pic1.jpg',
                'http://example.com/newsa/pic2.png',
                // ...
            ],
            visiable: 1, // 表示新闻未被管理员隐藏，
            sticky: 1, // 0表示不置顶，1表示置顶，按照数组顺序显示即可
            stickedAt: 'ytbuhnim', // 置顶时间
            createdAt: 'tyghunmj', // 新闻发布时间
            updatedAt: 'tygbhunjm' // 新闻更新时间
        }
    ];


    let vm = this;
    vm.allChecked = false;
    vm.checkList = [];
    vm.allCheckedChange = allCheckedChange;

    initController();


    function initController() {
        Restangular.all('newses').getList().then(function (response) {
            vm.newsList = list;
            vm.newsList.forEach(function (value) {
                value.checked = false;
            });
        }).catch(function (error) {
            AlertService.warning(error.data);
        });
    }

    /**
     * @ngdoc   function
     * @desc    点击选择全部的多选框
     */
    function allCheckedChange() {
        if (vm.allChecked) {
            vm.newsList.forEach(function (value) {
                value.checked = true;
            });
        } else {
            vm.newsList.forEach(function (value) {
                value.checked = false;
            });
        }
    }

    /**
     *  @ngdoc   $watch
     *  @desc   改变单个复选框的监听程序
     */
    $scope.$watch('scope.newsList', function ($new, $old) {
        let arr;
        if ($new !== $old) {
            arr = vm.newsList.filter(function (item) {
                return item.checked;
            });
            vm.allChecked = arr.length === 0 ? false : true;
        }
    }, true);
}