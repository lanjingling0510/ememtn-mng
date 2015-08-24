require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.tourist.list', [
    'ui.router',
    'sanya.common.services',
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
function TouristListController($timeout, Restangular, AlertService) {
    const vm = this;
    const Tourist = Restangular.all('tourists');
    vm.disableTourist = disableTourist;
    vm.enableTourist = enableTourist;
    vm.removeTourist = removeTourist;
    vm.fetchTourists = fetchTourists;
    vm.querystring = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 15,
        total: 0,
    };
    fetchTourists(vm.querystring);

    function disableTourist(tourist) {
        tourist.doPUT({}, 'disablement').then(function () {
            tourist.status = 'disabled';
            AlertService.success('冻结成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableTourist(tourist) {
        tourist.doPUT({}, 'enablement').then(function () {
            tourist.status = 'enabled';
            AlertService.success('解冻成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
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
    function fetchTourists(querystring = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            Tourist.getList(querystring).then(function (tourists) {
                vm.querystring.total = tourists[0];
                vm.tourists = tourists.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
