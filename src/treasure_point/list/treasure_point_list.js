require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-point.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasurePointListController', TreasurePointListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual.treasure-point-list', {
        url: '/treasure-points',
        template: require('./treasure_point_list.html'),
        controller: 'TreasurePointListController as vm',
    });
}

/*@ngInject*/
function TreasurePointListController() {
    // const vm = this;
}