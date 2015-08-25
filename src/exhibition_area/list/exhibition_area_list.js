require('./exhibition_area_list.less');
require('../../common/service.js');
const angular = require('angular');
//const config = require('../../config.json');

module.exports = angular.module('ememtn.exhibition-area.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaListController', ExhibitionAreaListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-list', {
        url: '/areas',
        template: require('./exhibition_area_list.html'),
        controller: 'ExhibitionAreaListController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaListController($stateParams, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const ExhibitionArea = Restangular.one('exhibition-areas');
    vm.floors = floors;
    const floor = $stateParams.floor.split(':');
    vm.exhibitionArea = {
        JCObjId: floor.unshift(),
        JCObjMask: floor.unshift(),
        pictures: [],
    };
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.setExhibitionArea = setExhibitionArea;
    fetchExhibitionArea($stateParams.floor);

    function fetchExhibitionArea(floorId) {
        vm.exhibitionArea = ExhibitionArea.one(floorId).get().$object;
    }

    function uploadFile(files) {
        if (!files || files.length === 0) {
            return false;
        }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            const pictures = fileUrls.map(function (fileUrl) {
                return {
                    fileUrl: fileUrl,
                    description: '',
                    isNew: true,
                };
            });
            vm.exhibitionArea.pictures = vm.exhibitionArea.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.exhibitionArea.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index) {
        vm.exhibitionArea.one('pictures', index).remove().then(() => {
            vm.exhibitionArea.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function setExhibitionArea(exhibitionArea) {
        ExhibitionArea.doPUT(exhibitionArea, $stateParams.floor).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
