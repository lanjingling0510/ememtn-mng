require('./exhibition_dist.less');
require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.exhibition.dist', [
        'ui.router',
        'sanya.common.services',
    ]).config(moduleConfig)
    .controller('ExhibitionDistController', ExhibitionDistController)
    .controller('ExhibitionDistDetailController', ExhibitionDistDetailController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-dist', {
        url: '/exhibition/_dist',
        template: '<ui-view />',
        controller: 'ExhibitionDistController as vm',
        resolve: {
            floors: function ($q) {
                return $q.resolve(config.floors);
            },
        },
    }).state('exhibition-dist.detail', {
        url: '/:floor',
        template: require('./exhibition_dist.html'),
        controller: 'ExhibitionDistDetailController as vm',
    });
}

/* @ngInject */
function ExhibitionDistController($state, floors) {
    const firstFloor = floors[0];
    $state.go('exhibition-dist.detail', {
        floor: firstFloor.JCObjId + ':' + firstFloor.JCObjMask,
    });
}

/* @ngInject */
function ExhibitionDistDetailController($stateParams, floors, Restangular, UploadToTempService, AlertService) {
    const vm = this;
    const ExhibitionDist = Restangular.one('exhibition-dists');
    vm.floors = floors;
    const floor = $stateParams.floor.split(':');
    vm.exhibitionDist = {
        JCObjId: floor.unshift(),
        JCObjMask: floor.unshift(),
        pictures: [],
    };
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.setExhibitionDist = setExhibitionDist;
    fetchExhibitionDist($stateParams.floor);

    function fetchExhibitionDist(floorId) {
        vm.exhibitionDist = ExhibitionDist.one(floorId).get().$object;
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
            vm.exhibitionDist.pictures = vm.exhibitionDist.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.exhibitionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteOldFile(picture, index) {
        vm.exhibitionDist.one('pictures', index).remove().then(() => {
            vm.exhibitionDist.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function setExhibitionDist(exhibitionDist) {
        ExhibitionDist.doPUT(exhibitionDist, $stateParams.floor).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
