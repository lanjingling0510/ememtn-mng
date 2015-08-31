require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.batch', [
    'ui.router',
    'sanya.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('ExhibitorBatchController', ExhibitorBatchController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.exhibitor-batch', {
        url: '/batch_exhibitors',
        template: require('./exhibitor_batch.html'),
        controller: 'ExhibitorBatchController as vm',
    });
}

/*@ngInject*/
function ExhibitorBatchController($scope, Restangular, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    vm.removeSelectedExhibitors = removeSelectedExhibitors;
    vm.query = {
        pageSize: 10,
    };

    $scope.$on('map-change', onFloorChange);

    searchExhibitors(vm.query);

    function searchExhibitors(query) {
        vm.exhibitors = Exhibitor.getList(query).$object;
    }

    function onFloorChange(event, data) {
        vm.floor = data;
    }

    function getSelectedExhibitors() {
        return vm.exhibitors.filter((exh) => exh._checked);
    }

    function removeExhibitor(exhibitor) {
        exhibitor.remove().then(() => {
            const index = vm.exhibitors.indexOf(exhibitor);
            vm.exhibitors.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeSelectedExhibitors() {
        const selectedExhibitors = getSelectedExhibitors();
        selectedExhibitors.forEach(removeExhibitor);
    }
}
