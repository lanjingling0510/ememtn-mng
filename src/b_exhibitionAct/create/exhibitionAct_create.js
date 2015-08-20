let angular = require('angular');

module.exports = angular.module('ememtn.exhibitionAct.create', [
    'ui.router',
    'restangular',
])
    .config(moduleConfig)
    .controller('ExhibitionActCreateController', ExhibitionActCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitionAct_create', {
        url: '/exhibitionAct_create',
        template: require('./exhibitionAct_create.html'),
        controller: 'ExhibitionActCreateController as scope',
    });
}

/* @ngInject*/
function ExhibitionActCreateController() {
    let vm = this;
}
