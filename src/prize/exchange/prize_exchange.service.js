const angular = require('angular');

module.exports = angular.module('ememtn.prize_exchange.service', [
    'ngResource',
]).service('PrizeExchangeService', PrizeExchangeService);

/* @ngInject */
function PrizeExchangeService($resource) {
    const url = '/apis/prizes/:prizeId';

    return $resource(url, null, {
        exchangePrize: {
            url: url + '/exchanging',
            method: 'POST',
            params: {
                prizeId: '@_id',
            },
        },
    });
}
