require('./treasure_area_batch.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-area.batch', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaBatchController', ExhibitionAreaBatchController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map.treasure-area-batch', {
        url: '/area_batch',
        template: require('./treasure_area_batch.html'),
        controller: 'ExhibitionAreaBatchController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaBatchController($q, $timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.all('treasure-areas');
    const MapFeature = Restangular.all('map-features');
    vm.searchExhibitionAreas = searchExhibitionAreas;
    vm.removeSelectedExhibitionAreas = removeSelectedExhibitionAreas;
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };

    $scope.$on('map-change', onFloorChange);
    $scope.$on('current-map', onFloorChange);
    $scope.$emit('get-current-map');

    let searchTimer;
    function searchExhibitionAreas(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        $timeout(() => {
            ExhibitionArea.getList(query).then((exhibitionAreas) => {
                vm.query.total = exhibitionAreas[0];
                vm.exhibitionAreas = exhibitionAreas.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function onFloorChange(event, data) {
        if (data && data.map && data.map.profile) {
            vm.query.JCObjId = data.map.profile.JCObjId;
            vm.query.JCObjMask = data.map.profile.JCObjMask;
            searchExhibitionAreas(vm.query);
        }
    }

    function getSelectedAreas() {
        return vm.exhibitionAreas.filter((area) => area._checked);
    }

    function removeExhibitionArea(exhibitionArea) {
        return MapFeature.one(exhibitionArea.JCGUID).remove({
            profileId: exhibitionArea.JCObjId + ':' + exhibitionArea.JCObjMask,
            JCLayerName: exhibitionArea.JCLayerName,
        }).then(() => {
            return exhibitionArea.remove();
        }).then(() => {
            const index = vm.exhibitionAreas.indexOf(exhibitionArea);
            vm.exhibitionAreas.splice(index, 1);
            return $q.resolve(exhibitionArea);
        }).catch((err) => {
            return $q.reject(err);
        });
    }

    function removeSelectedExhibitionAreas() {
        const selectedExhibitionAreas = getSelectedAreas();
        const proms = selectedExhibitionAreas.map(removeExhibitionArea);
        $q.all(proms).then(() => {
            searchExhibitionAreas(vm.query);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
