const angular = require('angular');

module.exports = angular.module('ememtn.stadium.detail', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('StadiumDetailController', StadiumDetailController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('stadium_detail', {
        url: '/stadium_detail',
        template: require('./stadium_detail.html'),
        controller: 'StadiumDetailController as scope',
    });
}

/* @ngInject*/
function StadiumDetailController() {
    const vm = this;
}
