require('../../common/service.js');
require('../../treasure_game/list/treasury_game_list.less');
const angular = require('angular');

module.exports = angular.module('ememtn.roulette-game.config', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('RouletteGameConfigController', RouletteGameConfigController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('roulette-game-config', {
        url: '/roulette-game',
        template: require('./roulette_game.html'),
        controller: 'RouletteGameConfigController as scope',
    });
}

/* @ngInject */
function RouletteGameConfigController($stateParams, Restangular, AlertService) {
    const vm = this;
    const PrizeType = Restangular.all('prize-types');
    const RouletteGame = Restangular.all('roulette-games');

    vm.setupGame = function setupGame(game) {
        RouletteGame.post(game).then(function () {
            AlertService.success('设置成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        PrizeType.getList().then(function (prizeTypes) {
            vm.prizeTypes = prizeTypes.slice(1);
            return RouletteGame.getList({ offswitch: true });
        }).then(function (rouletteGames) {
            vm.game = rouletteGames[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
