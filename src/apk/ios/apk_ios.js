const angular = require('angular');

module.exports = angular.module('ememtn.apk.ios', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ApkIosController', ApkIosController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('apk-ios', {
        url: '/apk/ios',
        template: require('./apk_ios.html'),
        controller: 'ApkIosController as vm',
    });
}

/* @ngInject */
function ApkIosController() {

}
