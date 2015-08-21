const angular = require('angular');

module.exports = angular.module('ememtn.information.create', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('InformationCreateController', InformationCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('information-create', {
        url: '/information/create',
        template: require('./information_create.html'),
        controller: 'InformationCreateController as vm',
    });
}

/* @ngInject */
function InformationCreateController() {

}
