'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.home.directives')
    .directive('jcAppInstall', jcAppInstall);

/* @ngInject */
function  jcAppInstall() {
    return {
        template: require('./app_install.directive.html'),
        link: link
    };

    function link() {

    }
}
