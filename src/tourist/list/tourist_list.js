require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.tourist.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TouristListController', TouristListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('tourist-list', {
        url: '/tourists',
        template: require('./tourist_list.html'),
        controller: 'TouristListController as vm',
    });
}

/* @ngInject */
function TouristListController($q, $timeout, Restangular, AlertService) {
    const vm = this;
    const Tourist = Restangular.all('tourists');
    vm.disableCheckedTourists = disableCheckedTourists;
    vm.enableCheckedTourists = enableCheckedTourists;
    vm.removeTourist = removeTourist;
    vm.searchTourists = searchTourists;
    vm.toggleCheckAll = toggleCheckAll;
    vm.query = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 16,
        total: 0,
    };
    searchTourists(vm.query);

    function disableCheckedTourists() {
        const tourists = getCheckedTourists();
        const proms = tourists.map(disableTourist);
        $q.all(proms).then(function () {
            AlertService.success('冻结成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableCheckedTourists() {
        const tourists = getCheckedTourists();
        const proms = tourists.map(enableTourist);
        $q.all(proms).then(function () {
            AlertService.success('解冻成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableTourist(tourist) {
        return tourist.all('enablement').put().then(() => {
            tourist.status = 'enabled';
            return $q.resolve(true);
        });
    }

    function disableTourist(tourist) {
        return tourist.all('disablement').put().then(() => {
            tourist.status = 'disabled';
            return $q.resolve(true);
        });
    }

    function removeTourist(tourist, index) {
        AlertService.danger('确定要删除此游客帐号？').then(function () {
            return tourist.remove();
        }).then(function () {
            vm.tourists.splice(index, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    let fetchTimer;
    function searchTourists(query = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            Tourist.getList(query).then(function (tourists) {
                vm.query.total = tourists[0];
                vm.tourists = tourists.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function toggleCheckAll(checked) {
        vm.tourists.forEach((tour) => {
            tour._checked = checked;
        });
    }

    function getCheckedTourists() {
        return vm.tourists.filter((tour) => tour._checked);
    }
}
