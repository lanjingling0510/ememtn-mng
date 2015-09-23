const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.edit', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitorEditController', ExhibitorEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-edit', {
        url: '/exhibitors/:exhibitorId',
        template: require('./exhibitor_edit.html'),
        controller: 'ExhibitorEditController as vm',
    });
}

/* @ngInject*/
function ExhibitorEditController(Restangular, UploadToTempService, $stateParams, AlertService) {
    const vm = this;
    vm.exhibitor = Restangular.all('exhibitors').get($stateParams.exhibitorId).$object;

    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.submitExhibitor = submitExhibitor;
    vm.onPictureUploaded = onPictureUploaded;

    function onPictureUploaded(fileUrls) {
        const pictures = fileUrls.map(function (fileUrl) {
            return {
                fileUrl: fileUrl,
                description: '',
                isNew: true,
            };
        });
        vm.exhibitor.pictures = vm.exhibitor.pictures.concat(pictures);
    }

    function uploadFile(files, cb) {
        if (!files) { return false; }
        UploadToTempService.upload(files).then(cb).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.exhibitor.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index) {
        vm.exhibitor.one('pictures', index).remove().then(() => {
            vm.exhibitor.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function submitExhibitor(exhibitor) {
        exhibitor.put().then(() => {
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
