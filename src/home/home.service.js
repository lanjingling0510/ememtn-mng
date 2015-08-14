'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.home.service', [
    'ngResource'
]).service('HomeService', HomeService);

function HomeService($resource) { }
