const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.exhibitor.create', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitorCreateController', ExhibitorCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-create', {
        url: '/exhibitors/_create',
        template: require('./exhibitor_create.html'),
        controller: 'ExhibitorCreateController as vm',
    });
}

/* @ngInject*/
function ExhibitorCreateController(Restangular, UploadToTempService, $stateParams, AlertService) {
    const vm = this;
    const Exhibitor = Restangular.all('exhibitors');
    vm.floors = config.floors.slice(1);
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.submitExhibitor = submitExhibitor;
    vm.onThunbnailUploaded = onThunbnailUploaded;
    vm.onPictureUploaded = onPictureUploaded;
    vm.exhibitor = {
        floor: vm.floors[0],
        pictures: [],
    };

    function onThunbnailUploaded(fileUrls) {
        vm.exhibitor.thunbnail = {
            fileUrl: fileUrls[0],
            isNew: true,
        };
    }

    function onPictureUploaded(fileUrls) {
        const pictures = fileUrls.map(function (fileUrl) {
            return {
                fileUrl: fileUrl,
                description: '',
                isNew: true,
            };
        });
        vm.exhibitor.pictures.push(...pictures);
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

    function submitExhibitor(exhibitor) {
        Exhibitor.post(exhibitor).then(() => {
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
