const angular = require('angular');

module.exports = angular.module('ememtn.organizer-custom.create', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('OrganizerCustomCreateController', OrganizerCustomCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('organizer-custom-create', {
        url: '/organizer-customs/_create',
        template: require('./organizer_custom_create.html'),
        controller: 'OrganizerCustomCreateController as vm',
    });
}

/* @ngInject*/
function OrganizerCustomCreateController(Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const OrganizerCustom = Restangular.all('organizer-customs');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.createOrganizerCustom = createOrganizerCustom;
    vm.onThunbnailUploaded = onThunbnailUploaded;
    vm.onDeleteThunbnail = onDeleteThunbnail;
    vm.organizerCustom = {};

    function onPictureUploaded(fileUrls) {
        const pictures = fileUrls.map(function (fileUrl) {
            return {
                fileUrl: fileUrl,
                description: '',
                isNew: true,
            };
        });
        if (!vm.organizerCustom.pictures) { vm.organizerCustom.pictures = []; }
        Array.prototype.push.apply(vm.organizerCustom.pictures, pictures);
    }

    function onThunbnailUploaded(fileUrls) {
        const thunbnails = fileUrls.map(function (fileUrl) {
            return {
                fileUrl: fileUrl,
                description: '',
                isNew: true,
            };
        });
        if (!vm.organizerCustom.thunbnails) { vm.organizerCustom.thunbnails = []; }
        Array.prototype.push.apply(vm.organizerCustom.thunbnails, thunbnails);
    }

    function uploadFile(files, cb=onPictureUploaded) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then(cb).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onDeletePicture(index) {
        if (!vm.organizerCustom.pictures) { vm.organizerCustom.pictures = []; }
        vm.organizerCustom.pictures.splice(index, 1);
    }

    function onDeleteThunbnail(index) {
        if (!vm.organizerCustom.thunbnails) { vm.organizerCustom.thunbnails = []; }
        vm.organizerCustom.thunbnails.splice(index, 1);
    }

    function deleteNewFile(picture, index, cb=onDeletePicture) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(cb.bind(null, index)).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index, cb=onDeletePicture) {
        vm.organizerCustom.one('pictures', index).remove().then(cb.bind(null, index)).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function createOrganizerCustom(organizerCustom) {
        OrganizerCustom.post(organizerCustom).then(() => {
            organizerCustom.thunbnails.forEach((pic) => pic.isNew = false);
            organizerCustom.pictures.forEach((pic) => pic.isNew = false);
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
