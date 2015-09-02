require('./exhibition_hall_virtual.less');
require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.exhibition.virtual', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionHallVirtualController', ExhibitionHallVirtualController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-virtual', {
        url: '/exhibition-hall',
        template: require('./exhibition_hall_virtual.html'),
        controller: 'ExhibitionHallVirtualController as vm',
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
function ExhibitionHallVirtualController($scope, floors) {
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
