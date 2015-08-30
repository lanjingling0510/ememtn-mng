const angular = require('angular');

module.exports = angular.module('ememtn.exhibit.create', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitCreateController', ExhibitCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibit-create', {
        url: '/exhibits/_create?exhibitorId',
        template: require('./exhibit_create.html'),
        controller: 'ExhibitCreateController as vm',
    });
}

/* @ngInject*/
function ExhibitCreateController() {
    const vm = this;
    vm.exhibitor = {
        _id: 'exhibitorIdrtfvgybhuj'
    };
}
