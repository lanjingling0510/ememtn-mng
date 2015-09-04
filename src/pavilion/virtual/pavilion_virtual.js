require('./pavilion_virtual.less');
require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.pavilion.virtual', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('PavilionVirtualController', PavilionVirtualController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-virtual', {
        url: '/pavilion',
        template: require('./pavilion_virtual.html'),
        controller: 'PavilionVirtualController as vm',
        resolve: {
            floors: getFloors,
        },
    });
}

/* @ngInject */
function getFloors($q) {
    return $q.resolve(config.floors.slice(1));
}

/* @ngInject */
function PavilionVirtualController($scope, floors) {
    const vm = this;
    vm.floors = floors;
    vm.floor = floors[0];
    vm.floorChange = floorChange;

    floorChange(vm.floor);

    function floorChange(floor) {
        vm.floor = floor;
        $scope.$broadcast('floor-change', {
            floor: floor,
        });
    }
}
