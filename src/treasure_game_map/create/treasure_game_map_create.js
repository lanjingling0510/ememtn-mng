require('../../common/service.js');
require('../../treasure_type/list/treasure_type_list.service.js');
require('./treasure_game_map_create.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure_game_map.create', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasure_type.list.service',
    'ememtn.treasure_game_map.create.service',
]).config(moduleConfig)
    .controller('TreasureGameMapCreateController', TreasureGameMapCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('treasure_game_map_create', {
            url: '/treasure-game/maps/new',
            template: require('./treasure_game_map_create.html'),
            controller: 'TreasureGameMapCreateController as scope',
        });
}

/* @ngInject */
function TreasureGameMapCreateController(Restangular, TreasureGameMapCreateService, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('exhibition-areas');
    const TreasureType = Restangular.all('treasure-types');
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
        ExhibitionArea.getList().then(function (areas) {
            vm.areas = areas.slice(1);
            return TreasureType.getList();
        }).then(function (treasureTypes) {
            vm.treasureTypes = treasureTypes.slice(1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
