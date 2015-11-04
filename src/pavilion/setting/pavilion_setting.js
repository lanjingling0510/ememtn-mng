require('./pavilion_setting.less');
require('../../common/service.js');
require('../../_directives/floor_button_group');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.pavilion.setting', [
    'ui.router',
    'ememtn.common.services',
    'jc.directive.floor-button-group',
]).config(moduleConfig)
    .controller('PavilionSettingController', PavilionSettingController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-setting', {
        url: '/pavilions/_setting',
        template: require('./pavilion_setting.html'),
        controller: 'PavilionSettingController as vm',
    });
}

/* @ngInject */
function PavilionSettingController($scope, $stateParams, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const Pavilion = Restangular.all('pavilions');
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];

    fetchPavilionByFloor(vm.floor);
    vm.fetchPavilionByFloor = fetchPavilionByFloor;
    vm.uploadPicture = uploadPicture;
    vm.removeNewPicture = removeNewPicture;
    vm.removeOldPicture = removeOldPicture;
    vm.savePavilion = savePavilion;
    vm.fetchPavilionByFloor = fetchPavilionByFloor;

    function fetchPavilionByFloor(floor) {
        vm.pavilion = Pavilion.doGET('', {
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).$object;
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
