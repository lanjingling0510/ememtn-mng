'use strict';
/* global AMap */

require('../../common/service.js');
require('../../poi/poi.js');
require('./beacons.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.beacon.edit', [
    'ui.router',
    'sanya.common.services',
    'sanya.beacons.service'
]).config(moduleConfig)
    .controller('EditBeaconController', EditBeaconController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi.beacons_edit', {
        url: '/beacons/:beaconId',
        template: require('./edit_beacon.html'),
        controller: 'EditBeaconController as scope'
    });
}


/* @ngInject */
function EditBeaconController($stateParams, BeaconsService, AlertService) {
    let vm = this;
    vm.updateBeacon = updateBeacon;

    initController();

    function updateBeacon(beacon) {
        beacon.$update().then(function () {
            AlertService.success('更新成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        BeaconsService.get({ beaconId: $stateParams.beaconId }).$promise.then(function (beacon) {
            vm.beacon = beacon;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
