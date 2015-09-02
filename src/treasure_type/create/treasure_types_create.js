require('../../common/service.js');
require('./treasure_types_create.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure_types_create', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasure_types_create.service',
]).config(moduleConfig)
    .controller('TreasureTypesCreateController', TreasureTypesCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure_types_create', {
        url: '/treasure-types/new',
        template: require('./treasure_types_create.html'),
        controller: 'TreasureTypesCreateController as scope',
    });
}

/* @ngInject */
function TreasureTypesCreateController($stateParams, TreasureTypesCreateService, AlertService) {
    const vm = this;

    vm.createTreasureType = function createTreasureType(treasureTypeIcon, treasureType) {
        TreasureTypesCreateService.create(treasureTypeIcon, treasureType)
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };
    initController();

    function initController() {
        vm.treasureType = {};
    }
}
