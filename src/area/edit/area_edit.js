require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('sanya.area.edit', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('AreaEditController', AreaEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.area-edit', {
        url: '/areas/:areaId',
        template: require('./area_edit.html'),
        controller: 'AreaEditController as vm',
    });
}

/* @ngInject */
function AreaEditController() {
    // body...
}
