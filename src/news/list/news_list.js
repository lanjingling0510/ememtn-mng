const angular = require('angular');
// const templateNews = require('./modal.html');

module.exports = angular.module('ememtn.news.list', [
    'ui.router',
    'restangular',
    'common.modal.service',
    'common.slideBox.directive',
]).config(moduleConfig)
    .controller('NewsListController', NewsListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('news-list', {
        url: '/newses',
        template: require('./news_list.html'),
        controller: 'NewsListController as vm',
    });
}

/* @ngInject */
function NewsListController($q, Restangular, AlertService, $scope, commonModal) { // eslint-disable-line no-unused-vars
    const vm = this;
    const News = Restangular.all('newses');
    vm.query = {
        page: 1,
        pageSize: 30,
        count: 0,
    };
    // vm.allChecked = false;
    // vm.checkList = [];
    // vm.allCheckedChange = allCheckedChange;
    // vm.searchNewses = searchNewses;
    vm.toggleCheckAll = toggleCheckAll;
    vm.showCheckedNews = showCheckedNews;
    vm.hideCheckedNews = hideCheckedNews;
    vm.stickyNews = stickyNews;
    vm.stickyCheckedNews = stickyCheckedNews;
    vm.transferCheckedNewsToInfo = transferCheckedNewsToInfo;
    vm.removeCheckedNews = removeCheckedNews;

    // initController();
    searchNewses(vm.query);

    function searchNewses(query) {
        vm.newses = News.getList(query).$object;
    }

    function toggleCheckAll(checked) {
        vm.newses.forEach(function (news) {
            news.checked = checked;
        });
    }

    function getCheckedNewses() {
        return vm.newses.filter((news) => news.checked);
    }

    function hideCheckedNews() {
        const checkedNewses = getCheckedNewses();
        checkedNewses.forEach(function (news) {
            News.one(news._id).doPUT({}, 'hide').then(function () {
                news.visible = 0;
                news.updatedAt = new Date().toISOString();
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function showCheckedNews() {
        const checkedNewses = getCheckedNewses();
        checkedNewses.forEach(function (news) {
            News.one(news._id).doPUT({}, 'show').then(function () {
                news.visible = 1;
                news.updatedAt = new Date().toISOString();
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function stickyNews(news) {
        News.one(news._id).doPUT({}, 'sticky').then(function () {
            news.sticky = 1;
            news.stickedAt = new Date().toISOString();
            news.updatedAt = new Date().toISOString();
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function stickyCheckedNews() {
        const checkedNewses = getCheckedNewses();
        checkedNewses.forEach(stickyNews);
    }

    function transferCheckedNewsToInfo() {
        const checkedNewses = getCheckedNewses();
        checkedNewses.forEach(function (news) {
            News.one(news._id).doPUT({}, 'transfer').then(function () {
                const newsIndex = vm.newses.indexOf(news);
                vm.newses.splice(newsIndex, 1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function removeCheckedNews() {
        const checkedNewses = getCheckedNewses();
        checkedNewses.forEach(function (news) {
            News.one(news._id).remove().then(function () {
                const newsIndex = vm.newses.indexOf(news);
                vm.newses.splice(newsIndex, 1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    // function initController() {
    //     Restangular.all('newses').getList().then(() => {
    //         vm.newsList = list;
    //         vm.newsList.forEach((value) => {
    //             value.checked = false;
    //         });
    //     }).catch((error) => {
    //         AlertService.warning(error.data);
    //     });
    //
    //     commonModal.fromTemplateUrl(templateNews, {
    //         scope: $scope,
    //     })
    //         .then(function (modal) {
    //             vm.modal = modal;
    //         });
    //
    //     vm.closeModal = function () {
    //         vm.modal.hide();
    //     };
    //
    //     vm.showModal = function () {
    //         vm.modal.show();
    //     };
    // }
}