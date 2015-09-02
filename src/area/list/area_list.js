require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.area.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('AreaListController', AreaListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.area-list', {
        url: '/areas',
        template: require('./area_list.html'),
        controller: 'AreaListController as vm',
    });
}

/*@ngInject*/
function AreaListController(AlertService) {

}
