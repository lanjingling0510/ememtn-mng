require('../../common/service.js');
require('../../pavilion/map/pavilion_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.area.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('AreaEditController', AreaEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion.area-edit', {
        url: '/areas/:areaId',
        template: require('./area_edit.html'),
        controller: 'AreaEditController as vm',
    });
}

/* @ngInject */
function AreaEditController() {
    // body...
}
