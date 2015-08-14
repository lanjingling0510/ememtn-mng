'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.roulette_game.service', [
    'ngResource'
]).service('RouletteGameService', RouletteGameService);

/* @ngInject */
function RouletteGameService($resource) {
    let url = '/apis/roulette-games/:rouletteGameId';
    return $resource(url, null, { });
}
