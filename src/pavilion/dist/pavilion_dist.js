require('./pavilion_dist.less');
require('../../common/service.js');
require('../../_directives/jc_emei_floors_button_group');
const angular = require('angular');

module.exports = angular.module('ememtn.pavilion.dist', [
    'ui.router',
    'ememtn.common.services',
    'jc.emei.floors.button_group.directive',
]).config(moduleConfig)
    .controller('PavilionDistController', PavilionDistController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-dist', {
        url: '/pavilions/_dist',
        template: require('./pavilion_dist.html'),
        controller: 'PavilionDistController as vm',
    });
}

/* @ngInject */
function PavilionDistController($scope, $state, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const PavilionDist = Restangular.all('exhibition-dists');
    vm.uploadFile = uploadFile;
    vm.removeNewPicture = removeNewPicture;
    vm.removeOldPicture = removeOldPicture;
    vm.setPavilionDist = setPavilionDist;
    vm.fetchPavilionDist = fetchPavilionDist;

    function fetchPavilionDist(floor) {
        vm.pavilionDist = PavilionDist.doGET('', {
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).$object;
    }

    function uploadFile(files) {
        if (!files || files.length === 0) {
            return false;
        }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            const pictures = fileUrls.map(function (fileUrl) {
                return {
                    fileUrl: fileUrl,
                    description: '',
                    isNew: true,
                };
            });
            vm.pavilionDist.pictures = vm.pavilionDist.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeNewPicture(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.pavilionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function removeOldPicture(picture, index) {
        vm.pavilionDist.one('pictures', picture._id).remove().then(() => {
            vm.pavilionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function setPavilionDist(pavilionDist) {
        PavilionDist.one(pavilionDist._id).doPUT(pavilionDist).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
