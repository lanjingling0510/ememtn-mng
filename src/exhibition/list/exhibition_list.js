const angular = require('angular');

module.exports = angular.module('ememtn.exhibition.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
    'common.collapse.directive',
]).config(moduleConfig)
    .controller('ExhibitionListController', ExhibitionListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-list', {
        url: '/exhibitions',
        template: require('./exhibition_list.html'),
        controller: 'ExhibitionListController as vm',
    });
}

/* @ngInject*/
function ExhibitionListController(Restangular, AlertService) {
    const vm = this;
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {};

    searchExhibitions(vm.query);

    function searchExhibitions(query) {
        vm.exhibitions = Exhibition.getList(query).$object;
    }
}
