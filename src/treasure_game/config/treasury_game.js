require('../../common/service.js');
require('../../prize_type/list/prize_types.service.js');
require('../../treasure_type/list/treasure_types.service.js');
require('./treasury_game.service.js');
require('./treasury_game.less');
const angular = require('angular');

module.exports = angular.module('ememtn.treasury_game', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.prize_types.service',
    'ememtn.treasure_types.service',
    'ememtn.treasury_game.service',
]).config(moduleConfig)
    .controller('TreasureGameController', TreasureGameController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasury_game', {
        url: '/treasury-game',
        template: require('./treasury_game.html'),
        controller: 'TreasureGameController as scope',
    });
}

/* @ngInject */
function TreasureGameController($stateParams, PrizeTypesService, TreasureTypesService, TreasureGameService, AlertService) {
    const vm = this;

    vm.addTarget = function addTarget() {
        vm.game.gathers = vm.game.gathers || [];
        vm.game.gathers.push({});
    };

    vm.removeTarget = function removeTarget(target, index) {
        vm.game.gathers.splice(index, 1);
    };

    vm.setupGame = function setupGame(game) {
        TreasureGameService.save(game).$promise
        .then(function () {
            AlertService.success('设置成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        PrizeTypesService.query().$promise
        .then(function (prizeTypes) {
            vm.prizeTypes = prizeTypes;
            return TreasureTypesService.query().$promise;
        }).then(function (treasureTypes) {
            vm.treasureTypes = treasureTypes;
            return TreasureGameService.query({ offswitch: true }).$promise;
        }).then(function (treasureGames) {
            if (treasureGames.length === 0) {
                treasureGames.push({
                    gathers: [{}],
                });
            }
            vm.game = treasureGames[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
