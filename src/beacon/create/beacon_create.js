require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.create', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('BeaconCreateController', BeaconCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.beacon-create', {
        url: '/beacons/new',
        template: require('./beacon_create.html'),
        controller: 'BeaconCreateController as vm',
    });
}


/* @ngInject */
function BeaconCreateController(AlertService) {

}
