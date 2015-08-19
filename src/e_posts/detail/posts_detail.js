"use strict";

require('./posts_detail.less');
let angular = require('angular');

module.exports = angular.module('ememtn.posts.detail', [
    'restangular',
])
    .config(moduleConfig)
    .controller('PlatformDetailController', PlatformDetailController);

/* @Inject*/
function moduleConfig($stateProvider) {
    $stateProvider.state('posts_detail', {
        url: '/posts/:_id',
        template: require('./posts_detail.html'),
        controller: PlatformDetailController,
        controllerAs: 'scope',
    });
}

/* @Inject*/
function PlatformDetailController($stateParams, Restangular, AlertService) {
    let post = {
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
        createdAt: '2012-2-1', // 发帖时间
        updatedAt: '2015-5-2', // 帖子更新时间
    };

    let vm = this;
    initController();

    function initController() {
        Restangular.one('posts', $stateParams.id).get().then(function (response) {
            vm.post = post;
        });
    }

    function deleteComment(id) {
        vm.post.one('comments', id).remove()
        .then(function () {
            //......
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
