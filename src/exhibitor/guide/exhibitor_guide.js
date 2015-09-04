require('../../common/service.js');
require('../../pavilion/map/pavilion_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.guide', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitorGuideController', ExhibitorGuideController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-guide', {
        url: '/exhibitors/_guide',
        template: require('./exhibitor_guide.html'),
        controller: 'ExhibitorGuideController as vm',
    });
}

/*@ngInject*/
function ExhibitorGuideController() { }
