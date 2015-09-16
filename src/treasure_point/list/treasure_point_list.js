require('../../common/service.js');
require('../../treasure_area/virtual/treasure_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-point.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasurePointListController', TreasurePointListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.treasure-point-list', {
        url: '/treasure-points',
        template: require('./treasure_point_list.html'),
        controller: 'TreasurePointListController as vm',
    });
}

/*@ngInject*/
function TreasurePointListController() {
    // const vm = this;
}
