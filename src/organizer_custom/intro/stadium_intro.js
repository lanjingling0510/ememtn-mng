"use strict";
let angular = require('angular');

module.exports = angular.module('ememtn.stadium', [
    'ui.router',
    'restangular'
])
    .config(moduleConfig)
    .controller('StadiumIntroController', StadiumIntroController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('stadium', {
        url: '/stadium',
        template: require('./stadium_intro.html'),
        controller: 'StadiumIntroController as scope',
    });
}

/* @ngInject*/
function StadiumIntroController() {
    let vm = this;
}