require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.prize-type.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('PrizeTypeListController', PrizeTypeListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize-type-list', {
        url: '/prize-types',
        template: require('./prize_type_list.html'),
        controller: 'PrizeTypeListController as vm',
    });
}

/* @ngInject */
function PrizeTypeListController($timeout, $stateParams, Restangular, AlertService) {
    const vm = this;
    const PrizeType = Restangular.all('prize-types');
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
        prizeType.doPUT(prizeType, 'enable').then(function () {
            prizeType.status = 'enabled';
            AlertService.success('启用成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeCouponCategory(prizeType) {
        prizeType.remove().then(function () {
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
            PrizeType.getList(filters).then(function (prizeTypes) {
                vm.querystring.total = prizeTypes[0];
                vm.prizeTypes = prizeTypes.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
