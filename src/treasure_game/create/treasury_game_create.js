require('../../common/service.js');
require('./treasury_game_create.less');
const angular = require('angular');

module.exports = angular.module('ememtn.treasury-game.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasureGameCreateController', TreasureGameCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasury-game-create', {
        url: '/treasury-game/_create',
        template: require('./treasury_game_create.html'),
        controller: 'TreasureGameCreateController as vm',
    });
}

/* @ngInject */
function TreasureGameCreateController($stateParams, Restangular, AlertService) {
    const vm = this;
    const TreasureGame = Restangular.all('treasure-games');
    const PrizeType = Restangular.all('prize-types');
    const TreasureType = Restangular.all('treasure-types');

    vm.setupGame = function setupGame(game) {
        TreasureGame.post(game).then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        PrizeType.getList().then(function (prizeTypes) {
            vm.prizeTypes = prizeTypes;
            return TreasureType.getList();
        }).then(function (treasureTypes) {
            vm.treasureTypes = treasureTypes;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
