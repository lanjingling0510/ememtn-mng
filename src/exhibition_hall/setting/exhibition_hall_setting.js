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
function ExhibitionHallSettingController($stateParams, Restangular, AlertService) {
    const vm = this;
    vm.fetchExhibitionHallSettingByFloor = fetchExhibitionHallSettingByFloor;
    vm.saveExhibitionHallSetting = saveExhibitionHallSetting;
    fetchExhibitionHallSettingByFloor($stateParams.floor);

    function fetchExhibitionHallSettingByFloor(floor) {
        vm.exhibitionHallSetting = Restangular.one('exhibition-halls', floor).get().$object;
    }

    function saveExhibitionHallSetting(setting) {
        setting.save().then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
