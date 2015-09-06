require('../../common/service.js');
require('./treasure_type_create.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-type.create', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.treasure_types_create.service',
]).config(moduleConfig)
    .controller('TreasureTypeCreateController', TreasureTypeCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-type-create', {
        url: '/treasure-types/_create',
        template: require('./treasure_type_create.html'),
        controller: 'TreasureTypeCreateController as scope',
    });
}

/* @ngInject */
function TreasureTypeCreateController($stateParams, TreasureTypesCreateService, AlertService) {
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
