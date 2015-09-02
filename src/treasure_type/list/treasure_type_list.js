require('../create/treasure_types_create.js');
require('../edit/treasure_type_edit.js');

require('../../common/service.js');
require('./treasure_types.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure_type.list', [
    'ui.router',
    'ememtn.treasure_type.create',
    'ememtn.treasure_type.edit',
    'ememtn.common.services',
    'ememtn.treasure_type.list.service',
]).config(moduleConfig)
    .controller('TreasureTypesController', TreasureTypesController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure_types', {
        url: '/treasure-types',
        template: require('./treasure_types.html'),
        controller: 'TreasureTypesController as vm',
    });
}

/* @ngInject */
function TreasureTypesController($timeout, $stateParams, TreasureTypesService, AlertService) {
    const vm = this;
    Object.defineProperty(vm, 'timestamp', {
        get: function () {
            return Date.now();
        },
    });

    vm.disableCouponCategory = disableTreasureType;
    vm.enableCouponCategory = enableTreasureType;
    vm.removeCouponCategory = removeTreasureType;
    vm.fetchTreasureTypes = fetchTreasureTypes;
    vm.querystring = {
        status: 'valid',
        page: 1,
        pageSize: 15,
        total: 0,
    };
    fetchTreasureTypes(vm.querystring, 0);

    function disableTreasureType(treasureType) {
        TreasureTypesService.disable({ _id: treasureType._id }).$promise
        .then(function () {
            treasureType.status = 'invalid';
            AlertService.success('禁用成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableTreasureType(treasureType) {
        TreasureTypesService.enable({ _id: treasureType._id }).$promise
        .then(function () {
            treasureType.status = 'valid';
            AlertService.success('启用成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeTreasureType(treasureType) {
        TreasureTypesService.remove({ _id: treasureType._id }).$promise
        .then(function () {
            let couponCategoryIndex = -1;
            vm.treasureTypes.forEach(function (item, index) {
                if (item._id === treasureType._id) {
                    couponCategoryIndex = index;
                }
            });
            vm.treasureTypes.splice(couponCategoryIndex, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    let fetchTimer;
    function fetchTreasureTypes(querystring, delay = 200) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            TreasureTypesService.query(querystring).$promise.then(function (treasureTypes) {
                vm.querystring.total = treasureTypes[0];
                vm.treasureTypes = treasureTypes.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
