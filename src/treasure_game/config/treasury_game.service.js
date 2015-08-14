'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.treasury_game.service', [
    'ngResource'
]).service('TreasureGameService', TreasureGameService);

/* @ngInject */
function TreasureGameService($resource) {
    let url = '/apis/treasure-games/:treasureGameId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                treasureGameId: '@_id'
            }
        }
    });
}
