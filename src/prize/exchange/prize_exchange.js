const angular = require('angular');
require('../../common/service.js');
require('./prize_exchange.service.js');

module.exports = angular.module('ememtn.prize.exchange', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.prize_exchange.service',
]).config(moduleConfig)
    .controller('PrizeExchangeController', PrizeExchangeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize-exchange', {
        url: '/prize/exchange',
        template: require('./prize_exchange.html'),
        controller: 'PrizeExchangeController as vm',
    });
}

/* @ngInject */
function PrizeExchangeController($timeout, PrizeExchangeService, AlertService) {
    const vm = this;
    vm.fetchPrizeByCode = fetchPrizeByCode;
    vm.exchangePrize = exchangePrize;

    initController();

    let fetchPrizeTimer;
    const fetchPrizeDelay = 100;

    function fetchPrizeByCode(exchangeCode) {
        $timeout.cancel(fetchPrizeTimer);
        fetchPrizeTimer = $timeout(function () {
            PrizeExchangeService.get({ prizeId: exchangeCode }).$promise.then(function (prize) {
                vm.prize = prize;
            });
        }, fetchPrizeDelay);
    }

    function exchangePrize(prize) {
        prize.$exchangePrize().then(function () {
            AlertService.success('兑换成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        // vm.prize = {};
    }
}
