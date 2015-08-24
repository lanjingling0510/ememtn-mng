require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.attendant.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('AttendantListController', AttendantListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('attendant-list', {
        url: '/attendants',
        template: require('./attendant_list.html'),
        controller: 'AttendantListController as vm',
    });
}

/* @ngInject */
function AttendantListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('attendants');
    vm.removeAttendant = removeAttendant;
    vm.searchAttendants = searchAttendants;
    vm.removeCheckedAttendants = removeCheckedAttendants;
    vm.checkAll = checkAll;
    vm.querystring = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 15,
        total: 0,
    };
    searchAttendants(vm.querystring);

    $scope.$on('custom.attendant.created', function () {
        searchAttendants(vm.querystring);
    });

    let fetchTimer;
    function searchAttendants(querystring = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            vm.attendants = Attendant.getList(querystring).$object;
        }, delay);
    }

    function removeAttendant(attendant, index) {
        AlertService.danger('确定要删除此客服帐号？').then(function () {
            return attendant.remove();
        }).then(function () {
            attendant._checked = false;
            const idx = index === undefined ? vm.attendants.indexOf(attendant) : index;
            vm.attendants.splice(idx, 1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function checkAll() {
        const checked = vm.attendants._checked;
        vm.attendants.forEach(function (attendant) {
            attendant._checked = checked;
        });
    }

    function getCheckedAttendants() {
        return vm.attendants.filter((attendant) => attendant._checked);
    }

    function removeCheckedAttendants() {
        const checkedAttendants = getCheckedAttendants();
        checkedAttendants.forEach(removeAttendant);
    }
}
