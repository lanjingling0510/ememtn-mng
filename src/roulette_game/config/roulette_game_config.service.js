const angular = require('angular');

module.exports = angular.module('ememtn.roulette_game.config.service', [
    'ngResource',
]).service('RouletteGameService', RouletteGameService);

/* @ngInject */
function RouletteGameService($resource) {
    const url = '/apis/roulette-games/:rouletteGameId';
    return $resource(url, null, { });
}
