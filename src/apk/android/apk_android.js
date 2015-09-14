const angular = require('angular');

module.exports = angular.module('ememtn.apk.android', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ApkandroidController', ApkandroidController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('apk-android', {
        url: '/apk/android',
        template: require('./apk_android.html'),
        controller: 'ApkandroidController as vm',
    });
}

/* @ngInject */
function ApkandroidController() {

}
