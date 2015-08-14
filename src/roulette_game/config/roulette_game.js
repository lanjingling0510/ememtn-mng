'use strict';

require('../../common/service.js');
require('../../prize_type/list/prize_types.service.js');
require('./roulette_game.service.js');
require('../../treasure_game/config/treasury_game.less');
let angular = require('angular');

module.exports = angular.module('sanya.roulette_game', [
    'ui.router',
    'sanya.common.services',
    'sanya.prize_types.service',
    'sanya.roulette_game.service'
]).config(moduleConfig)
    .controller('RouletteGameController', RouletteGameController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('roulette_game', {
        url: '/roulette-game',
        template: require('./roulette_game.html'),
        controller: 'RouletteGameController as scope'
    });
}

/* @ngInject */
function RouletteGameController($stateParams, PrizeTypesService, RouletteGameService, AlertService) {
    let vm = this;

    vm.setupGame = function setupGame(game) {
        RouletteGameService.save(game).$promise
        .then(function () {
            AlertService.success('设置成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        PrizeTypesService.query().$promise
        .then(function (prizeTypes) {
            vm.prizeTypes = prizeTypes.slice(1);
            return RouletteGameService.query({ offswitch: true }).$promise;
        }).then(function (rouletteGames) {
            vm.game = rouletteGames[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
