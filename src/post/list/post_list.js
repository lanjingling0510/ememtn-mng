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

    vm.removeCheckedPosts = removeCheckedPosts;
    vm.toggleCheckAll = toggleCheckAll;
    vm.searchPosts = searchPosts;
    vm.query = {};

    searchPosts(vm.query, 0);

    let searchTimer;
    function searchPosts(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            vm.posts = Post.getList(query).$object;
        }, delay);
    }

    function getCheckedPosts() {
        const checkedPosts = vm.posts.filter((post) => post._checked);
        return checkedPosts;
    }

    function removeCheckedPosts() {
        const checkedPosts = getCheckedPosts();
        const proms = checkedPosts.map(removePost);
        $q.all(proms).then(() => {
            AlertService.success('删除成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removePost(post) {
        return post.remove().then(() => {
            const index = vm.posts.indexOf(post);
            vm.posts.splice(index, 1);
            $q.resolve(true);
        });
    }

    function toggleCheckAll(checked) {
        vm.posts.forEach(post => {
            post._checked = checked;
        });
    }
}
