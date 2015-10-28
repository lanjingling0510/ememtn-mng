const angular = require('angular');
// const templateInfo = require('./modal.html');

module.exports = angular.module('ememtn.info.list', [
    'ui.router',
    'restangular',
    'common.slideBox.directive',
]).config(moduleConfig)
    .controller('InfoController', InfoController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('info-list', {
        url: '/infoes',
        template: require('./info_list.html'),
        controller: 'InfoController as vm',
    });
}

/* @ngInject */
function InfoController($q, Restangular, AlertService) { // eslint-disable-line no-unused-vars
    const vm = this;
    const Info = Restangular.all('infoes');
    vm.query = {
        page: 1,
        pageSize: 16,
        count: 0,
        total: 0,
    };
    // vm.allChecked = false;
    // vm.checkList = [];
    // vm.allCheckedChange = allCheckedChange;
    vm.searchInfoes = searchInfoes;
    vm.toggleCheckAll = toggleCheckAll;
    vm.showCheckedInfo = showCheckedInfo;
    vm.hideCheckedInfo = hideCheckedInfo;
    vm.stickyInfo = stickyInfo;
    vm.stickyCheckedInfo = stickyCheckedInfo;
    vm.transferCheckedInfoToInfo = transferCheckedInfoToInfo;
    vm.removeCheckedInfo = removeCheckedInfo;

    // initController();
    searchInfoes(vm.query);

    function searchInfoes(query) {
        Info.getList(query).then((infoes) => {
            vm.query.total = infoes[0];
            vm.infoes = infoes.slice(1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function toggleCheckAll(checked) {
        vm.infoes.forEach(function (info) {
            info.checked = checked;
        });
    }

    function getCheckedInfoes() {
        return vm.infoes.filter((info) => info.checked);
    }

    function hideCheckedInfo() {
        const checkedInfoes = getCheckedInfoes();
        checkedInfoes.forEach(function (info) {
            Info.one(info._id).doPUT({}, 'hide').then(function () {
                info.visible = 0;
                info.updatedAt = new Date().toISOString();
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function showCheckedInfo() {
        const checkedInfoes = getCheckedInfoes();
        checkedInfoes.forEach(function (info) {
            Info.one(info._id).doPUT({}, 'show').then(function () {
                info.visible = 1;
                info.updatedAt = new Date().toISOString();
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function stickyInfo(info) {
        Info.one(info._id).doPUT({}, 'sticky').then(function () {
            info.sticky = 1;
            info.stickedAt = new Date().toISOString();
            info.updatedAt = new Date().toISOString();
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function stickyCheckedInfo() {
        const checkedInfoes = getCheckedInfoes();
        checkedInfoes.forEach(stickyInfo);
    }

    function transferCheckedInfoToInfo() {
        const checkedInfoes = getCheckedInfoes();
        checkedInfoes.forEach(function (info) {
            Info.one(info._id).doPUT({}, 'transfer').then(function () {
                const infoIndex = vm.infoes.indexOf(info);
                vm.infoes.splice(infoIndex, 1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    function removeCheckedInfo() {
        const checkedInfoes = getCheckedInfoes();
        checkedInfoes.forEach(function (info) {
            Info.one(info._id).remove().then(function () {
                const infoIndex = vm.infoes.indexOf(info);
                vm.infoes.splice(infoIndex, 1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        });
    }

    // function initController() {
    //     Restangular.all('infoes').getList().then(() => {
    //         vm.infoList = list;
    //         vm.infoList.forEach((value) => {
    //             value.checked = false;
    //         });
    //     }).catch((error) => {
    //         AlertService.warning(error.data);
    //     });
    //
    //     commonModal.fromTemplateUrl(templateInfo, {
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
