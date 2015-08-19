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
        _id: 'post Id', // ����Id
        userId: 'post userId', // ������Id
        subject: 'post subject', // ��������
        content: 'post content', // ��������
        comments: [// ��������
            {
                _id: 'comment userId', // ����Id
                userId: 'comment userId', // �������û�Id
                comment: 'comment', // ��������
                createdAt: 'ytgbhunj', // ����ʱ��
            },
            // ...
        ],
        createdAt: '2012-2-1', // ����ʱ��
        updatedAt: '2015-5-2', // ���Ӹ���ʱ��
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
