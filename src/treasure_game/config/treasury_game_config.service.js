const angular = require('angular');

module.exports = angular.module('ememtn.treasury_game.service', [
    'ngResource',
]).service('TreasureGameService', TreasureGameService);

/* @ngInject */
function TreasureGameService($resource) {
    const url = '/apis/treasure-games/:treasureGameId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                treasureGameId: '@_id',
            },
        },
    });
}
