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
    vm.query = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 2,
        total: 0,
    };
    searchAttendants(vm.query);

    $scope.$on('custom.attendant.created', function () {
        searchAttendants(vm.query);
    });

    let fetchTimer;
    function searchAttendants(query = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            Attendant.getList(query).then((attendants) => {
                vm.query.total = attendants[0];
                vm.attendants = attendants.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
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
