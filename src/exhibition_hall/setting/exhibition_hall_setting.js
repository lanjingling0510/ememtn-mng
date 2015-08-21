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
    vm.savePavilion = savePavilion;
    vm.pictureFiles = [];
    fetchPavilionByFloor($stateParams.floor);
    vm.uploadPicture = uploadPicture;
    vm.removePicture = removePicture;

    function fetchPavilionByFloor() {
        vm.pavilion = Pavilion.one($stateParams.floor).get().$object;
    }

    function uploadPicture(picture) {
        if (!picture) { return false; }
        const url = `/apis/pavilions/${$stateParams.floor}/pictures`;//'/api/pavilions/' + $stateParams.floor + '';
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
        vm.pavilion.doDELETE(`pictures/${pictureIndex}`).then(() => {
            vm.pavilion.pictures.splice(pictureIndex, 0);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function savePavilion(pavilion) {
        // url, files, fileFieldName, fields, method='POST') {
        const url = '/apis/pavilions/' + $stateParams.floor;
        UploadService(url, vm.pictureFiles, 'pictures', pavilion).then(() => { // eslint-disable-line new-cap
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
