require('./info_create.less');
const angular = require('angular');

module.exports = angular.module('ememtn.info.create', [
    'ui.router',
    'restangular',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('InfoCreateController', InfoCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('info-create', {
        url: '/info/create',
        template: require('./info_create.html'),
        controller: 'InfoCreateController as vm',
    });
}

/* @ngInject */
function InfoCreateController(AlertService, Restangular, UploadToTempService) {
    const vm = this;
    const Info = Restangular.all('infoes');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.submitInfo = submitInfo;
    vm.info = {
        pictures: [],
    };

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

    function submitInfo(info) {
        Info.post(info).then(() => {
            info._saved = true;
            info.pictures.forEach(function (pic) {
                pic.isNew = false;
            });
            AlertService.success('发布成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
