//require('./info_edit.less');
const angular = require('angular');

module.exports = angular.module('ememtn.info.edit', [
    'ui.router',
    'restangular',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('InfoEditController', InfoEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('info-edit', {
        url: '/info/:infoId',
        template: require('./info_edit.html'),
        controller: 'InfoEditController as vm',
    });
}

/* @ngInject */
function InfoEditController(AlertService, $stateParams, Restangular, UploadToTempService) {
    const vm = this;
    const Info = Restangular.all('infoes');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.submitInfo = submitInfo;

    fetchInfo($stateParams.infoId);

    function fetchInfo(infoId) {
        Info.get(infoId).then((info) => {
            vm.info = info;
            vm.info.pictures.forEach((pic, index) => {
                vm.info.pictures[index].isOld = true;
            });
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            const pictures = fileUrls.map(function (fileUrl) {
                return {
                    fileUrl: fileUrl,
                    description: '',
                    isNew: true,
                };
            });
            vm.info.pictures = vm.info.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.info.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture) {
        // const filename = picture.fileUrl.split('/').pop();
        const index = vm.info.pictures.indexOf(picture);
        vm.info.one('pictures', index).doDELETE().then(() => {
            vm.info.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function submitInfo(info) {
        info.put().then(() => {
            vm.info._saved = true;
            vm.info.pictures.forEach((pic) => {
                pic.isNew = false;
                pic.isOld = false;
            });
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
