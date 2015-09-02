const angular = require('angular');
require('./home.directive.js');

module.exports = angular.module('ememtn.home', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.home.directives',
]).config(moduleConfig)
    .controller('HomeController', HomeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        template: require('./home.html'),
        controller: 'HomeController as vm',
    });
}

/* @ngInject */
function HomeController() {

}
