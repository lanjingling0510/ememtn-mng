require('./post_detail.less');
const angular = require('angular');

module.exports = angular.module('ememtn.post.detail', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('PostDetailController', PostDetailController);

/* @Inject*/
function moduleConfig($stateProvider) {
    $stateProvider.state('post-detail', {
        url: '/posts/:postId',
        template: require('./post_detail.html'),
        controller: PostDetailController,
        controllerAs: 'vm',
    });
}

/* @Inject*/
function PostDetailController($stateParams, Restangular, AlertService) {
    const vm = this;
    const Post = Restangular.all('posts');
    vm.deleteComment = deleteComment;

    fetchPost($stateParams.postId);

    function fetchPost(postId) {
        vm.post = Post.one(postId).get().$object;
    }

    function deleteComment(comment, index) {
        vm.post.one('comments', comment._id).remove().then(function () {
            vm.post.comments.splice(index, 1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
