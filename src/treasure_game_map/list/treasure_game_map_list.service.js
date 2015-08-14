'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.treasure_game_map_list.service', [
    'ngResource'
]).service('TreasureGameMapListService', TreasureGameMapListService);

/* @ngInject */
function TreasureGameMapListService($resource) {
    const url = '/apis/treasure-game-maps/:treasureGameMapId';
    return $resource(url, null, { });
}
