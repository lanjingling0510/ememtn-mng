require('../../common/service.js');
require('../../exhibition_hall/exhibition_hall.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.edit', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('BeaconEditController', BeaconEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.beacons-edit', {
        url: '/beacons/:beaconId',
        template: require('./beacon_edit.html'),
        controller: 'BeaconEditController as vm',
    });
}


/* @ngInject */
function BeaconEditController(AlertService) {

}
