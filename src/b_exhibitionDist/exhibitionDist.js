let angular = require('angular');

module.exports = angular.module('ememtn.exhibitionDist', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('ExhibitionDisController', ExhibitionDisController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitionDist', {
        url: '/exhibitionDist',
        template: require('./exhibitionDist.html'),
        controller: 'ExhibitionDisController as scope',
    });
}

/* @ngInject*/
function ExhibitionDisController() {
    let vm = this;
}
