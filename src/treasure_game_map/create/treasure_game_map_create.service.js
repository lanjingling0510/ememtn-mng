const angular = require('angular');

module.exports = angular.module('ememtn.treasure_game_map_create.service', [
    'ngResource',
]).service('TreasureGameMapCreateService', TreasureGameMapCreateService);

/* @ngInject */
function TreasureGameMapCreateService($resource) {
    const url = '/apis/treasure-game-maps';
    return $resource(url, null, { });
}
