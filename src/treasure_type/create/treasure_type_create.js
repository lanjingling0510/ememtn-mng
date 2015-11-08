require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-type.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasureTypeCreateController', TreasureTypeCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-type-create', {
        url: '/treasure-types/_create',
        template: require('./treasure_type_create.html'),
        controller: 'TreasureTypeCreateController as vm',
    });
}

/* @ngInject */
function TreasureTypeCreateController($stateParams, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const TreasureType = Restangular.all('treasure-types');
    vm.uploadFile = uploadFile;

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            vm.treasureType.icon = fileUrls[0];
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    vm.createTreasureType = function createTreasureType(treasureType) {
        TreasureType.post(treasureType).then(() => {
            AlertService.success('创建成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    };

    (function initController() {
        vm.treasureType = {};
    })();
}
