require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.manager.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ManagerListController', ManagerListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('manager-list', {
        url: '/managers',
        template: require('./manager_list.html'),
        controller: 'ManagerListController as vm',
    });
}

/* @ngInject */
function ManagerListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('managers');
    vm.removeAttendant = removeAttendant;
    vm.searchAttendants = searchAttendants;
    vm.removeCheckedAttendants = removeCheckedAttendants;
    vm.checkAll = checkAll;
    vm.query = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 16,
        total: 0,
    };
    searchAttendants(vm.query);

    let fetchTimer;
    function searchAttendants(query = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            Attendant.getList(query).then((managers) => {
                vm.query.total = managers[0];
                vm.managers = managers.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function removeAttendant(manager, index) {
        AlertService.danger('确定要删除此客服帐号？').then(function () {
            return manager.remove();
        }).then(function () {
            manager._checked = false;
            const idx = index === undefined ? vm.managers.indexOf(manager) : index;
            vm.managers.splice(idx, 1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function checkAll() {
        const checked = vm.managers._checked;
        vm.managers.forEach(function (manager) {
            manager._checked = checked;
        });
    }

    function getCheckedAttendants() {
        return vm.managers.filter((manager) => manager._checked);
    }

    function removeCheckedAttendants() {
        const checkedAttendants = getCheckedAttendants();
        checkedAttendants.forEach(removeAttendant);
    }
}
