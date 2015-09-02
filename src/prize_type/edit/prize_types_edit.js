'use strict';

require('../../common/service.js');
require('./prize_types_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.prize_types_edit', [
    'ui.router',
    'ememtn.common.services',
    'sanya.prize_types_edit.service'
]).config(moduleConfig)
    .controller('PrizeTypesEditController', PrizeTypesEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize_types_edit', {
        url: '/prize-types/:_id',
        template: require('./prize_types_edit.html'),
        controller: 'PrizeTypesEditController as scope'
    });
}

/* @ngInject */
function PrizeTypesEditController($stateParams, PrizeTypesEditService, AlertService) {
    let vm = this;
    vm.openCalender = openCalender;
    vm.updatePrizeType = updatePrizeType;
    vm.calender = {
        opened: false,
        minDate: new Date(),
        maxDate: Date.parse('2026-12-31'),
        format: 'yyyy-MM-dd',
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1
        }
    };
    initController();

    function openCalender() {
        vm.calender.opened = true;
    }

    function updatePrizeType(prizeTypeIcon, prizeType) {
        PrizeTypesEditService.update(prizeTypeIcon, prizeType)
        .then(function () {
            AlertService.success('更新成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        PrizeTypesEditService.get({
            prizeTypeId: $stateParams._id
        }).$promise.then(function (prizeType) {
            vm.prizeType = prizeType;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
