const angular = require('angular');

module.exports = angular.module('ememtn.treasure_game_map.list.service', [
    'ngResource',
]).service('TreasureGameMapListService', TreasureGameMapListService);

/* @ngInject */
function TreasureGameMapListService($resource) {
    const url = '/apis/treasure-game-maps/:treasureGameMapId';
    return $resource(url, null, { });
}
