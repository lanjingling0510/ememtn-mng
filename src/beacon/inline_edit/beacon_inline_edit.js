require('../../common/service.js');
require('../list/beacon_list.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.inline-edit', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.beacon.list',
]).config(moduleConfig)
    .controller('BeaconInlineEditController', BeaconInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.beacon-list.beacons-inline-edit', {
        url: '/:beaconId',
        template: require('./beacon_inline_edit.html'),
        controller: 'BeaconInlineEditController as vm',
    });
}


/* @ngInject */
function BeaconInlineEditController(AlertService) {

}
