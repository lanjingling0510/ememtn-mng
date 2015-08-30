const angular = require('angular');

module.exports = angular.module('ememtn.exhibit.create', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitCreateController', ExhibitCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibit-create', {
        url: '/exhibits/_create?exhibitorId',
        template: require('./exhibit_create.html'),
        controller: 'ExhibitCreateController as vm',
    });
}

/* @ngInject*/
function ExhibitCreateController(Restangular, $stateParams, UploadToTempService, AlertService) {
    const vm = this;
    const Exhibit = Restangular.all('exhibits');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.createExhibit = createExhibit;
    vm.onThunbnailUploaded = onThunbnailUploaded;
    vm.onDeleteThunbnail = onDeleteThunbnail;
    vm.exhibit = {
        exhibitorId: $stateParams.exhibitorId,
    };

    function onPictureUploaded(fileUrls) {
        const pictures = fileUrls.map(function (fileUrl) {
            return {
                fileUrl: fileUrl,
                description: '',
                isNew: true,
            };
        });
        if (!vm.exhibit.pictures) { vm.exhibit.pictures = []; }
        Array.prototype.push.apply(vm.exhibit.pictures, pictures);
    }

    function onThunbnailUploaded(fileUrl) {
        vm.exhibit.thunbnail = {
            fileUrl: fileUrl[0],
            isNew: true,
        };
    }

    function uploadFile(files, cb=onPictureUploaded) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then(cb).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onDeletePicture(index) {
        if (!vm.exhibit.pictures) { vm.exhibit.pictures = []; }
        vm.exhibit.pictures.splice(index, 1);
    }

    function onDeleteThunbnail() {
        delete vm.exhibit.thunbnail;
    }

    function deleteNewFile(picture, index, cb=onDeletePicture) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(cb.bind(null, index)).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index, cb=onDeletePicture) {
        vm.exhibit.one('pictures', index).remove().then(cb.bind(null, index)).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function createExhibit(exhibit) {
        Exhibit.post(exhibit).then(() => {
            exhibit.thunbnail.isNew = false;
            if (exhibit.pictures) {
                exhibit.pictures.forEach((pic) => pic.isNew = false);
            }
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
