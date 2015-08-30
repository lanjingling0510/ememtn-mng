const angular = require('angular');

module.exports = angular.module('ememtn.exhibit.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('ExhibitListController', ExhibitListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibit-list', {
        url: '/exhibits?exhibitorId',
        template: require('./exhibit_list.html'),
        controller: 'ExhibitListController as vm',
    });
}

/* @ngInject*/
function ExhibitListController(Restangular, $stateParams, AlertService) {
    const vm = this;
    const Exhibit = Restangular.all('exhibits');
    vm.query = {
        exhibitorId: $stateParams.exhibitorId,
    };

    searchExhibits(vm.query);

    function searchExhibits(query) {
        vm.exhibits = Exhibit.getList(query).$object;
    }
}
