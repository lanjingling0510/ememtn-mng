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
    $stateProvider.state('exhibition-hall-setting', {
        url: '/exhibition-hall/:floor',
        template: require('./exhibition_hall_setting.html'),
        controller: 'ExhibitionHallSettingController as vm',
    });
}

/* @ngInject */
function ExhibitionHallSettingController($stateParams, Restangular, UploadService, AlertService) {
    const vm = this;
    const Pavilion = Restangular.all('pavilions');
    vm.fetchPavilionByFloor = fetchPavilionByFloor;
    vm.uploadPicture = uploadPicture;
    vm.removePicture = removePicture;
    vm.savePavilion = savePavilion;

    fetchPavilionByFloor($stateParams.floor);

    function fetchPavilionByFloor() {
        vm.pavilion = Pavilion.one($stateParams.floor).get().$object;
    }

    function uploadPicture(picture) {
        if (!picture) {
            return false;
        }
        const url = `/apis/pavilions/${$stateParams.floor}/pictures`;
        UploadService(url, picture, 'pictures', {}).then((result) => { // eslint-disable-line new-cap
            const pictures = result.data.map(function (picUrl) {
                return {
                    fileUrl: picUrl,
                    description: '',
                };
            });
            Array.prototype.push.apply(vm.pavilion.pictures, pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removePicture(pictureIndex) {
        Pavilion.one(vm.pavilion.floor).one('pictures', pictureIndex).remove().then(() => {
            vm.pavilion.pictures.splice(pictureIndex, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function savePavilion(pavilion) {
        // PUT  /apis/pavilions/F1
        Pavilion.one(pavilion.floor).doPUT(pavilion).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
