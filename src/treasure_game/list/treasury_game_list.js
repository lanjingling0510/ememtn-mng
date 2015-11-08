require('../../common/service.js');
require('./treasury_game_list.less');
require('../create/treasury_game_create.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasury-game.list', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasury-game.create',
]).config(moduleConfig)
    .controller('TreasureGameListController', TreasureGameListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasury-game-list', {
        url: '/treasury-game',
        template: require('./treasury_game_list.html'),
        controller: 'TreasureGameListController as vm',
    });
}

/* @ngInject */
function TreasureGameListController($stateParams, Restangular, AlertService) {
    const vm = this;
    const TreasureGame = Restangular.all('treasure-games');
    const PrizeType = Restangular.all('prize-types');
    const TreasureType = Restangular.all('treasure-types');
    vm.updateGame = updateGame;
    vm.endGame = endGame;

    function updateGame(game) {
        if (game.lucky === undefined || game.lucky < 0 || game.lucky > 100) {
            return AlertService.warning('寻获宝藏的几率不正确');
        }

        game.treasureGameId = game._id;
        game.put().then(function () {
            AlertService.success('设置成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function endGame(game) {
        game.remove().then(function () {
            delete vm.runningGame;
            vm.endedGames.unshift(game);
            AlertService.success('游戏结束成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    (function init() {
        PrizeType.getList().then(function (prizeTypes) {
            vm.prizeTypes = prizeTypes;
            return TreasureType.getList();
        }).then(function (treasureTypes) {
            vm.treasureTypes = treasureTypes;
            return TreasureGame.getList({ offswitch: true });
        }).then(function (runningGames) {
            vm.runningGame = runningGames[0];
            return TreasureGame.getList({ offswitch: false });
        }).then(function (endedGames) {
            vm.endedGames = endedGames;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
