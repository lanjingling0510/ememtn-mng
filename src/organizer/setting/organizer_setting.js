const angular = require('angular');

module.exports = angular.module('ememtn.organizer.setting', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('OrganizerSettingController', OrganizerSettingController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('organizer-setting', {
        url: '/organizer',
        template: require('./organizer_setting.html'),
        controller: 'OrganizerSettingController as vm',
    });
}

/* @ngInject*/
function OrganizerSettingController(Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const Organizer = Restangular.one('organizer');
    vm.organizer = {
        pictures: [],
    };
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.setOrganizer = setOrganizer;
    fetchSponsorConfig();

    function fetchSponsorConfig() {
        vm.organizer = Organizer.get().$object;
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
            vm.organizer.pictures = vm.organizer.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.organizer.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index) {
        vm.organizer.one('pictures', index).remove().then(() => {
            vm.organizer.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function setOrganizer(organizer) {
        Organizer.doPOST(organizer, '').then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
