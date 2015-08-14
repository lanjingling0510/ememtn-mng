'use strict';

require('../../common/service.js');
require('../../prize_type/list/prize_types.service.js');
require('../../treasure_type/list/treasure_types.service.js');
require('./treasury_game.service.js');
require('./treasury_game.less');
let angular = require('angular');

module.exports = angular.module('sanya.treasury_game', [
    'ui.router',
    'sanya.common.services',
    'sanya.prize_types.service',
    'sanya.treasure_types.service',
    'sanya.treasury_game.service'
]).config(moduleConfig)
    .controller('TreasureGameController', TreasureGameController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasury_game', {
        url: '/treasury-game',
        template: require('./treasury_game.html'),
        controller: 'TreasureGameController as scope'
    });
}

/* @ngInject */
function TreasureGameController($stateParams, PrizeTypesService, TreasureTypesService, TreasureGameService, AlertService) {
    let vm = this;

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
                    gathers: [{}]
                });
            }
            vm.game = treasureGames[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }());
}
