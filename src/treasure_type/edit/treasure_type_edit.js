require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-type.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasureTypeEditController', TreasureTypeEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-type-edit', {
        url: '/treasure-types/:treasureTypeId',
        template: require('./treasure_type_edit.html'),
        controller: 'TreasureTypeEditController as vm',
    });
}

/* @ngInject */
function TreasureTypeEditController($stateParams, UploadToTempService, Restangular, AlertService) {
    const vm = this;
    const TreasureType = Restangular.all('treasure-types');
    vm.updateTreasureType = updateTreasureType;
    vm.uploadFile = uploadFile;

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            vm.treasureType.icon = fileUrls[0];
            vm.treasureType._newIcon = true;
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function updateTreasureType(treasureType) {
        treasureType.put().then(function () {
            AlertService.success('更新成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    (function initController() {
        TreasureType.get($stateParams.treasureTypeId).then(function (treasureType) {
            vm.treasureType = treasureType;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    })();
}
