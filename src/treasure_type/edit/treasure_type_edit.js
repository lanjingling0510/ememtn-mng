'use strict';

require('../../common/service.js');
require('./treasure_type_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.treasure_types_edit', [
    'ui.router',
    'ememtn.common.services',
    'sanya.treasure_types_edit.service'
]).config(moduleConfig)
    .controller('TreasureTypeEditController', TreasureTypeEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-type-edit', {
        url: '/treasure-types/:treasureTypeId',
        template: require('./treasure_type_edit.html'),
        controller: 'TreasureTypeEditController as scope'
    });
}

/* @ngInject */
function TreasureTypeEditController($stateParams, TreasureTypeEditService, AlertService) {
    let vm = this;
    vm.updateTreasureType = updateTreasureType;

    initController();

    function updateTreasureType(treasureTypeIcon, treasureType) {
        TreasureTypeEditService.update(treasureTypeIcon, treasureType)
        .then(function () {
            AlertService.success('更新成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        TreasureTypeEditService.get({
            treasureTypeId: $stateParams.treasureTypeId
        }).$promise.then(function (treasureType) {
            vm.treasureType = treasureType;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
