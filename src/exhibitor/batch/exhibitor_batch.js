require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.batch', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('ExhibitorBatchController', ExhibitorBatchController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.exhibition-area-virtual.exhibitor-batch', {
        url: '/batch_exhibitors',
        template: require('./exhibitor_batch.html'),
        controller: 'ExhibitorBatchController as vm',
    });
}

/*@ngInject*/
function ExhibitorBatchController($timeout, $q, $scope, Restangular, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    const MapFeature = Restangular.all('map-features');
    vm.removeSelectedExhibitors = removeSelectedExhibitors;
    vm.searchExhibitors = searchExhibitors;
    vm.toggleCheckAll = toggleCheckAll;
    vm.query = {
        page: 1,
        pageSize: 10,
        total: 0,
    };

    $scope.$on('map-change', onFloorChange);
    searchExhibitors(vm.query, 0);

    let searchTimer;
    function searchExhibitors(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            Exhibitor.getList(query).then((exhibitors) => {
                vm.query.total = exhibitors[0];
                vm.exhibitors = exhibitors.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function onFloorChange(event, data) {
        vm.floor = data;
    }

    function getSelectedExhibitors() {
        return vm.exhibitors.filter((exh) => exh._checked);
    }

    function removeExhibitor(exhibitor) {
        console.log(exhibitor);
        return MapFeature.one(exhibitor.JCGUID).remove({
            profileId: exhibitor.JCObjId + ':' + exhibitor.JCObjMask,
            JCLayerName: exhibitor.JCLayerName,
        }).then(() => {
            return exhibitor.remove();
        }).then(() => {
            const index = vm.exhibitors.indexOf(exhibitor);
            vm.exhibitors.splice(index, 1);
            return $q.resolve(exhibitor);
        }).catch((err) => {
            return $q.reject(err);
        });
    }

    function removeSelectedExhibitors() {
        const selectedExhibitors = getSelectedExhibitors();
        const proms = selectedExhibitors.map(removeExhibitor);
        $q.all(proms).then(() => {
            searchExhibitors(vm.query);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function toggleCheckAll(checked) {
        vm.exhibitors.forEach((exhibitor) => {
            exhibitor._checked = checked;
        });
    }
}
