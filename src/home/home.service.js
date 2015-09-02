const angular = require('angular');

module.exports = angular.module('ememtn.home.service', [
    'ngResource',
]).service('HomeService', HomeService);

function HomeService() { }
