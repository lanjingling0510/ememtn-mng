'use strict';

require('../../common/service.js');
require('./tourists.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.tourists', [
    'ui.router',
    'sanya.common.services',
    'sanya.tourists.service'
]).config(moduleConfig)
    .controller('TouristController', TouristController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('tourists', {
        url: '/tourists',
        template: require('./tourists.html'),
        controller: 'TouristController as vm'
    });
}

/* @ngInject */
function TouristController($timeout, $stateParams, TouristsService, AlertService) {
    let vm = this;
    vm.disableTourist = disableTourist;
    vm.enableTourist = enableTourist;
    vm.removeTourist = removeTourist;
    vm.fetchTourists = fetchTourists;
    vm.querystring = {
        status: 'enabled',
        phone: '',
        page: 1,
        pageSize: 15,
        total: 0
    };
    fetchTourists(vm.querystring);

    function disableTourist(tourist) {
        TouristsService.disable({_id: tourist._id}).$promise
            .then(function () {
                tourist.status = 'disabled';
                AlertService.success('冻结成功');
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    }

    function enableTourist(tourist) {
        TouristsService.enable({_id: tourist._id}).$promise
            .then(function () {
                tourist.status = 'enabled';
                AlertService.success('解冻成功');
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    }

    function removeTourist(tourist, index) {
        AlertService.danger('确定要删除此游客帐号？')
            .then(function () {
                return TouristsService.remove({touristId: tourist._id}).$promise;
            }).then(function () {
                vm.tourists.splice(index, 1);
                AlertService.success('删除成功');
            }).catch(function (err) {
                if (err) {
                    AlertService.warning(err.data);
                }
            });
    }

    let fetchTimer;
    function fetchTourists(querystring = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            TouristsService.query(querystring).$promise.then(function (tourists) {
                vm.querystring.total = tourists[0];
                vm.tourists = tourists.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
