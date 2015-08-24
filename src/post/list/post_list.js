require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.post.list', [
    'restangular',
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('PostListController', PostListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('post-list', {
        url: '/posts',
        template: require('./post_list.html'),
        controller: 'PostListController as vm',
    });
}

/* @ngInject*/
function PostListController(Restangular, AlertService, $scope, $timeout, $q) {
    const vm = this;
    const Post = Restangular.all('posts');

    vm.deleteCheckedPosts = deleteCheckedPosts;
    vm.query = {};

    searchPosts(vm.query);

    function searchPosts(query) {
        vm.posts = Post.getList(query).$object;
    }

    function getCheckedPosts() {
        const checkedPosts = vm.posts.filter((post) => post._checked);
        return checkedPosts;
    }

    function deleteCheckedPosts() {
        const checkedPosts = getCheckedPosts();
        const proms = checkedPosts.map(function (post) {
            return post.remove();
        });
        $q.all(proms).then(function () {
            checkedPosts.forEach(function (post) {
                const index = vm.posts.indexOf(post);
                vm.posts.splice(index, 1);
            });
        });
    }
}
