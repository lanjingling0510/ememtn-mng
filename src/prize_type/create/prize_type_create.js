require('../../common/service.js');
require('../../treasure_game/list/treasury_game_list.less');
const angular = require('angular');

module.exports = angular.module('ememtn.prize-type.create', [
    'ui.router',
    'ui.bootstrap',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('PrizeTypeCreateController', PrizeTypeCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('prize-types-create', {
        url: '/prize-types/_create',
        template: require('./prize_type_create.html'),
        controller: 'PrizeTypeCreateController as vm',
    });
}

/* @ngInject */
function PrizeTypeCreateController($stateParams, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const PrizeType = Restangular.all('prize-types');
    vm.openCalender = openCalender;
    vm.createPrizeType = createPrizeType;
    vm.uploadFile = uploadFile;
    vm.prizeType = {
        validTo: new Date(),
    };
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
    vm.EXCHANGE = {
        EXCHANGEABLE: 'yes',
        DISEXCHANGEABLE: 'no',
    };

    function openCalender() {
        vm.calender.opened = true;
    }

    function createPrizeType(prizeType) {
        PrizeType.post(prizeType)
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            vm.prizeType.icon = fileUrls[0];
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
