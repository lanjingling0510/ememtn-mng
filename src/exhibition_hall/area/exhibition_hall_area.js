require('./exhibition_hall_area.less');
require('../../common/service.js');
require('../virtual/exhibition_hall_virtual.js');
// const config = require('../../config.json');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition.dist', [
    'ui.router',
    'sanya.common.services',
    'ememtn.exhibition.virtual',
]).config(moduleConfig)
    .controller('ExhibitionHallAreaController', ExhibitionHallAreaController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-virtual.exhibition-dist', {
        url: '/_dist',
        template: require('./exhibition_hall_area.html'),
        controller: 'ExhibitionHallAreaController as vm',
    });
}

/* @ngInject */
function ExhibitionHallAreaController($scope, $state, floors, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const ExhibitionDist = Restangular.all('exhibition-dists');
    vm.uploadFile = uploadFile;
    vm.removeNewPicture = removeNewPicture;
    vm.removeOldPicture = removeOldPicture;
    vm.setExhibitionDist = setExhibitionDist;
    $scope.$on('floor-change', onFloorChange);
    vm.floor = floors[0];
    fetchExhibitionDist(vm.floor);

    function onFloorChange(event, data) {
        vm.floor = data.floor;
        fetchExhibitionDist(vm.floor);
    }

    function fetchExhibitionDist(floor) {
        vm.exhibitionDist = ExhibitionDist.doGET('', {
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).$object;
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
            vm.exhibitionDist.pictures = vm.exhibitionDist.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeNewPicture(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.exhibitionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeOldPicture(picture, index) {
        vm.exhibitionDist.one('pictures', picture._id).remove().then(() => {
            vm.exhibitionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function setExhibitionDist(exhibitionDist) {
        ExhibitionDist.one(exhibitionDist._id).doPUT(exhibitionDist).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
