"use strict";
let angular = require('angular');

module.exports = angular.module('ememtn.sponsor', [
    'ui.router',
    'restangular'
])
    .config(moduleConfig)
    .controller('SponsorController', SponsorController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('sponsor', {
        url: '/sponsor',
        template: require('./sponsor.html'),
        controller: 'SponsorController as scope',
    });
}

/* @ngInject*/
function SponsorController() {
    let vm = this;
}