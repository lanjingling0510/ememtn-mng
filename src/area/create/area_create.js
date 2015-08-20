require('../../common/service.js');
require('../../exhibition_hall/exhibition_hall.js');
const angular = require('angular');

module.exports = angular.module('ememtn.area.create', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('AreaCreateController', AreaCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall.area-create', {
        url: '/areas/new',
        template: require('./area_create.html'),
        controller: 'AreaCreateController as vm',
    });
}

/* @ngInject */
function AreaCreateController(AlertService) {

}
