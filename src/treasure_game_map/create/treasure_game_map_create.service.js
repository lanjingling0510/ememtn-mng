'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.treasure_game_map_create.service', [
    'ngResource'
]).service('TreasureGameMapCreateService', TreasureGameMapCreateService);

/* @ngInject */
function TreasureGameMapCreateService($resource) {
    let url = '/apis/treasure-game-maps';
    return $resource(url, null, { });
}
