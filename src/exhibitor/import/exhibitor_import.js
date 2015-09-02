require('../../common/service.js');
require('../list/exhibitor_list.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('BeaconCreateController', BeaconCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.beacon-create', {
        url: '/beacons/new',
        template: require('./exhibitor_import.html'),
        controller: 'BeaconCreateController as vm',
    });
}


/* @ngInject */
function BeaconCreateController(AlertService) {

}
