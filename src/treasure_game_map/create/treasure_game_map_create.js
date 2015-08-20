'use strict';
/* global AMap */

require('../../common/service.js');
require('../../treasure_type/list/treasure_types.service.js');
require('./treasure_game_map_create.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.treasure_game_map_create', [
    'ui.router',
    'sanya.common.services',
    'sanya.treasure_types.service',
]).config(moduleConfig)
    .controller('TreasureGameMapCreateController', TreasureGameMapCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('treasure_game_map_create', {
            url: '/treasure-game/maps/new',
            template: require('./treasure_game_map_create.html'),
            controller: 'TreasureGameMapCreateController as scope'
        });
}

/* @ngInject */
function TreasureGameMapCreateController(AreasListService, TreasureTypesService, TreasureGameMapCreateService, AlertService) {
    let vm = this;

    vm.createTreasureGameMap = createTreasureGameMap;

    initController();

    /****************** function definitions ************************/
    function createTreasureGameMap(gameMap) {
        TreasureGameMapCreateService.save(gameMap).$promise
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        AreasListService.query().$promise
        .then(function (areas) {
            vm.areas = areas;
            return TreasureTypesService.query().$promise;
        }).then(function (treasureTypes) {
            vm.treasureTypes = treasureTypes;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
