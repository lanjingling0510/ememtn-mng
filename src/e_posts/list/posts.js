'use strict';

require('../../common/service.js');
let angular = require('angular');

module.exports = angular.module('ememtn.posts', [
    'restangular',
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('PlatformController', PlatformController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('posts', {
        url: '/posts',
        template: require('./posts.html'),
        controller: 'PlatformController as scope',
    });
}

/* @ngInject*/
function PlatformController(Restangular, AlertService, $scope, $timeout ,$q) {
    let list = [
        {
            _id: 'post Id', // 帖子Id
            userId: 'post userId', // 发帖人Id
            subject: 'post subject', // 帖子主题
            content: 'post content', // 帖子内容
            comments: [// 所有评论
                {
                    _id: 'comment userId', // 回帖Id
                    userId: 'comment userId', // 回帖人用户Id
                    comment: 'comment', // 评论内容
                    createdAt: 'ytgbhunj', // 评论时间
                },
                // ...
            ],
            createdAt: 'tyghunmj', // 发帖时间
            updatedAt: 'tygbhunjm', // 帖子更新时间
        },
        {
            _id: 2,
            subject: 'sub2',
            content: "l'm content",
            createdAt: '2012-44-21',
            updatedAt: '2015-33-22',
        },
        {
            _id: 3,
            subject: 'sub3',
            content: "l'm content",
            createdAt: '2012-44-21',
            updatedAt: '2015-33-22',
        },
    ];

    let vm = this;
    vm.allChecked = false;
    vm.checkList = [];
    vm.allCheckedChange = allCheckedChange;
    vm.filterChange = filterChange;
    vm.deletePosts = deletePosts;
    vm.filters = {
        subject: null,
    };
    initController();


    function allCheckedChange() {
        if (vm.allChecked) {
            vm.posts.forEach(function (value) {
                value.checked = true;
            });
        } else {
            vm.posts.forEach(function (value) {
                value.checked = false;
            });
        }
    }

    $scope.$watch('scope.posts', function ($new, $old) {
        let arr;
        if ($new !== $old) {
            arr = vm.posts.filter(function (item) {
                return item.checked;
            });
            vm.allChecked = arr.length === 0 ? false : true;
        }
    }, true);


    function initController() {
        Restangular.all('posts').getList().then(function (response) {
            vm.posts = list;
            vm.posts.forEach(function (value) {
                value.checked = false;
            });
        }).catch(function (error) {
            AlertService.warning(error.data);
        });
    }

    let filterTimer = null;

    function filterChange(filters) {
        let querystring = filters.subject.trim() ? vm.filters : null;
        $timeout.cancel(filterTimer);
        filterTimer = $timeout(function () {
            Restangular.all('posts').getList(null, querystring).then(function (response) {
                vm.posts = response;
                vm.posts.forEach(function (value) {
                    value.checked = false;
                });
            }).catch(function (error) {
                AlertService.warning(error.data);
            });
        }, 200);
        vm.allChecked = false;
    }

    function deletePosts() {
        vm.posts.forEach(function (value) {
            value.checked && vm.checkList.push(value._id);
        });

        let promiseArr = vm.checkList.map(function(item) {
            return deletePost(item);
        });
        $q.all(promiseArr).then(function() {
        }).catch(function(err) {
            AlertService.warning(err.data);
        });
    }

    function deletePost(id) {
        return Restangular.one('posts', id).remove();
    }
}
