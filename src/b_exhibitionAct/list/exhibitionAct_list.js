"use strict";
let angular = require('angular');

module.exports = angular.module('ememtn.exhibitionAct', [
    'ui.router',
    'restangular'
])
    .config(moduleConfig)
    .controller('ExhibitionActController', ExhibitionActController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitionAct', {
        url: '/exhibitionAct',
        template: require('./exhibitionAct_list.html'),
        controller: 'ExhibitionActController as scope',
    });
}

/* @ngInject*/
function ExhibitionActController() {
    let vm = this;
}