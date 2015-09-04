/* global AMap */

require('../../common/service.js');
require('./treasure_game_map_list.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure_game_map.list', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasure_game_map.list.service',
]).config(moduleConfig)
    .controller('TreasureGameMapListController', TreasureGameMapListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('treasure_game_map_list', {
            url: '^/treasure-game/maps',
            template: require('./treasure_game_map_list.html'),
            controller: 'TreasureGameMapListController as scope',
        });
}

/* @ngInject */
function TreasureGameMapListController(TreasureGameMapListService, AlertService) {
    const vm = this;

    vm.removeTreasureGameMap = removeTreasureGameMap;

    initController();

    /***************** function definitions ******************/

    function removeTreasureGameMap(treasureGameMap) {
        TreasureGameMapListService.remove({ treasureGameMapId: treasureGameMap._id }).$promise
        .then(function () {
            let treasureGameMapIndex = -1;
            vm.treasureGameMaps.forEach(function (item, index) {
                if (item._id.toString() === treasureGameMap._id.toString()) { treasureGameMapIndex = index; }
            });
            vm.treasureGameMaps.splice(treasureGameMapIndex, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        TreasureGameMapListService.query().$promise
        .then(function (treasureGameMaps) {
            vm.treasureGameMaps = treasureGameMaps;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
