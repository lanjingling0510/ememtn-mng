const angular = require('angular');
const templateNews = require('./modal.html');

module.exports = angular.module('ememtn.news', [
    'ui.router',
    'restangular',
    'common.modal.service',
    'common.slideBox.directive',
]).config(moduleConfig)
    .controller('NewsController', NewsController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('news', {
        url: '/news',
        template: require('./news.html'),
        controller: 'NewsController as vm',
    });
}

/* @ngInject */
function NewsController($q, Restangular, AlertService, $scope, commonModal) {
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
                news.updatedAt = Date.now();
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
                news.updatedAt = Date.now();
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function stickyNews(news) {
        News.one(news._id).doPUT({}, 'sticky').then(function () {
            news.sticky = 1;
            news.stickedAt = Date.now();
            news.updatedAt = Date.now();
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
            News.one(news._id).doPUT({}, 'transformation').then(function () {
                const newsIndex = vm.newses[news];
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
