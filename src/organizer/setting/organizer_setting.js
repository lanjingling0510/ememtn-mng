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
function OrganizerSettingController(Restangular, UploadService, AlertService) {
    const vm = this;
    vm.saveOrganizerSetting = saveOrganizerSetting;
    fetchSponsorConfig();

    function fetchSponsorConfig() {
        vm.organizer = Restangular.one('organizer').get().$object;
    }

    function saveOrganizerSetting(picture, setting) {
        const url = '/apis/organizer';
        UploadService(url, picture, 'pictures', setting).then(() => { // eslint-disable-line new-cap
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
