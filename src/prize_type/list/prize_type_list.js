require('../../common/service.js');
require('./prize_types.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.prize_type.list', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.prize_type.list.service',
]).config(moduleConfig)
    .controller('PrizeTypesController', PrizeTypesController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('prize_types', {
            url: '/prize-types',
            template: require('./prize_types.html'),
            controller: 'PrizeTypesController as vm',
        });
}

/* @ngInject */
function PrizeTypesController($timeout, $stateParams, PrizeTypesService, AlertService) {
    const vm = this;
    vm.disablePrizeType = disablePrizeType;
    vm.enablePrizeType = enablePrizeType;
    vm.removeCouponCategory = removeCouponCategory;
    vm.fetchPrizeTypes = fetchPrizeTypes;
    vm.EXCHANGE = {
        EXCHANGEABLE: 'yes',
        DISEXCHANGEABLE: 'no',
    };
    vm.querystring = {
        status: 'enabled',
        exchangeable: '__all__',
        page: 1,
        pageSize: 15,
        total: 0,
    };
    fetchPrizeTypes(vm.querystring, 0);

    function disablePrizeType(prizeType) {
        PrizeTypesService.disable({ _id: prizeType._id }).$promise
        .then(function () {
            prizeType.status = 'disabled';
            AlertService.success('禁用成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enablePrizeType(prizeType) {
        PrizeTypesService.enable({ _id: prizeType._id }).$promise
        .then(function () {
            prizeType.status = 'enabled';
            AlertService.success('启用成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeCouponCategory(prizeType) {
        PrizeTypesService.remove({ _id: prizeType._id }).$promise
        .then(function () {
            let prizeTypeIndex = -1;
            vm.prizeTypes.forEach(function (item, index) {
                if (item._id === prizeType._id) {
                    prizeTypeIndex = index;
                }
            });
            vm.prizeTypes.splice(prizeTypeIndex, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    let fetchTimer;
    function fetchPrizeTypes(filters, delay = 200) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            PrizeTypesService.query(filters).$promise.then(function (prizeTypes) {
                vm.querystring.total = prizeTypes[0];
                vm.prizeTypes = prizeTypes.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
