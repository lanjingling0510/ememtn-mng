require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.prize-type.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('PrizeTypeEditController', PrizeTypeEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize_types_edit', {
        url: '/prize-types/:_id',
        template: require('./prize_type_edit.html'),
        controller: 'PrizeTypeEditController as vm',
    });
}

/* @ngInject */
function PrizeTypeEditController($stateParams, UploadToTempService, Restangular, AlertService) {
    const vm = this;
    const PrizeType = Restangular.all('prize-types');
    vm.openCalender = openCalender;
    vm.updatePrizeType = updatePrizeType;
    vm.uploadFile = uploadFile;
    vm.calender = {
        opened: false,
        minDate: new Date(),
        maxDate: Date.parse('2026-12-31'),
        format: 'yyyy-MM-dd',
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
        },
    };
    initController();

    function openCalender() {
        vm.calender.opened = true;
    }

    function updatePrizeType(prizeType) {
        prizeType.put().then(function () {
            AlertService.success('更新成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            vm.prizeType.icon = fileUrls[0];
            vm.prizeType._newIcon = true;
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        PrizeType.get($stateParams._id).then(function (prizeType) {
            vm.prizeType = prizeType;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
