const angular = require('angular');


module.exports = angular.module('ememtn.information', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('InformationController', InformationController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('information', {
        url: '/information',
        template: require('./information_list.html'),
        controller: 'InformationController as vm',
    });
}

/* @ngInject*/
function InformationController() {
    const vm = this;
}
