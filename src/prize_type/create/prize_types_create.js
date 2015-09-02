'use strict';

require('../../common/service.js');
require('./prize_types_create.service.js');
require('../../treasure_game/config/treasury_game.less');
let angular = require('angular');

module.exports = angular.module('sanya.prize_types_create', [
    'ui.router',
    'ui.bootstrap',
    'ememtn.common.services',
    'sanya.prize_types_create.service'
]).config(moduleConfig)
    .controller('PrizeTypesCreateController', PrizeTypesCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize_types_create', {
        url: '/prize-types/new',
        template: require('./prize_types_create.html'),
        controller: 'PrizeTypesCreateController as scope'
    });
}

/* @ngInject */
function PrizeTypesCreateController($stateParams, PrizeTypesCreateService, AlertService) {
    let vm = this;
    vm.openCalender = openCalender;
    vm.createPrizeType = createPrizeType;
    vm.prizeType = {
        validTo: new Date()
    };
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
    vm.EXCHANGE = {
        EXCHANGEABLE: 'yes',
        DISEXCHANGEABLE: 'no'
    };

    function openCalender() {
        vm.calender.opened = true;
    }

    function createPrizeType(prizeTypeIcon, prizeType) {
        PrizeTypesCreateService.create(prizeTypeIcon, prizeType)
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
