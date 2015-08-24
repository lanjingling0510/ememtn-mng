'use strict';

let angular = require('angular');
require('./home.directive.js');
require('./app_install_directive/app_install.directive.js');
require('./tourist_register_directive/tourist_register.directive.js');

module.exports = angular.module('sanya.home', [
    'ui.router',
    'sanya.common.services',
    'sanya.home.directives'
]).config(moduleConfig)
    .controller('HomeController', HomeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        template: require('./home.html'),
        controller: 'HomeController as vm'
    });
}

/* @ngInject */
function HomeController() {

}
