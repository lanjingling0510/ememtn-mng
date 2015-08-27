require('./exhibition_hall_setting.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-hall.setting', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('ExhibitionHallSettingController', ExhibitionHallSettingController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-virtual.exhibition-hall-setting', {
        url: '/_setting',
        template: require('./exhibition_hall_setting.html'),
        controller: 'ExhibitionHallSettingController as vm',
    });
}

/* @ngInject */
function ExhibitionHallSettingController($scope, floors, $stateParams, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const Pavilion = Restangular.all('pavilions');
    vm.fetchPavilionByFloor = fetchPavilionByFloor;
    vm.uploadPicture = uploadPicture;
    vm.removeNewPicture = removeNewPicture;
    vm.removeOldPicture = removeOldPicture;
    vm.savePavilion = savePavilion;
    $scope.$on('floor-change', onFloorChange);
    vm.floor = floors[0];
    fetchPavilionByFloor(vm.floor);

    function fetchPavilionByFloor(floor) {
        vm.pavilion = Pavilion.doGET('', {
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).$object;
    }

    function onFloorChange(event, data) {
        vm.floor = data.floor;
        fetchPavilionByFloor(vm.floor);
    }

    function uploadPicture(files) {
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
            vm.pavilion.pictures = vm.pavilion.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeNewPicture(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.pavilion.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeOldPicture(picture, index) {
        vm.pavilion.one('pictures', index).remove().then(() => {
            vm.pavilion.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function savePavilion(pavilion) {
        pavilion.doPUT(pavilion).then(() => {
            pavilion.pictures.forEach((pic) => {
                pic.isNew = false;
            });
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
