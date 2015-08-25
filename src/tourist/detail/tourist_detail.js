require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.tourist.detail', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('TouristDetailController', TouristDetailController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('tourist-detail', {
        url: '/tourists/:touristId',
        template: require('./tourist_detail.html'),
        controller: 'TouristDetailController as vm',
    });
}

/* @ngInject */
function TouristDetailController($stateParams, Restangular) {
    const vm = this;
    const Tourist = Restangular.all('tourists');

    fetchTourist($stateParams.touristId);

    function fetchTourist(touristId) {
        vm.tourist = Tourist.get(touristId).$object;
    }
}
