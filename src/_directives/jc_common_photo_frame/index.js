require('../../_services/temp_uploader');
const angular = require('angular');

module.exports = angular.module('jc.common.photo.frame.directive', [
    'jc.temp_upload.service',
]).directive('jcCommonPhotoFrame', JCCommonPhotoFrameDirective);

/* @ngInject*/
function JCCommonPhotoFrameDirective(TempUploadService) {
    return {
        restrict: 'E',
        scope: {
            picture: '=',
            deleteOldFile: '&',
        },
        template: require('./template.html'),
        replace: true,
        link: link,
    };

    function link(scope) {
        const vm = scope.vm = {};
        vm.picture = scope.picture;
        vm.deleteNewFile = _deleteNewFile;
        vm.deleteOldFile = scope.deleteOldFile || _deleteNewFile;

        function _deleteNewFile(picture) {
            TempUploadService.remove(picture.fileUrl).then(() => {

            });
        }
    }
}
