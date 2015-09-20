require('ng-file-upload');
const angular = require('angular');

module.exports = angular.module('jc.temp_upload.service', [
    'ngFileUpload',
]).factory('TempUploadService', TempUploadService);

/* @ngInject */
function TempUploadService($q, $rootScope, Restangular, Upload) {
    return {
        upload: upload,
        remove: remove,
    };

    function upload(files, url='/apis/upload', method='POST', fileFieldName='upload') {
        return $q(function (resolve, reject) {
            Upload.upload({
                url: url,
                file: files,
                method: method,
                headers: {'Authorization': 'Bearer ' + $rootScope.auth.accessToken},
                fileFormDataName: fileFieldName,
            }).then(function (res) {
                resolve(res.data);
            }).catch(reject);
        });
    }

    function remove(filename) {
        return Restangular.one('upload', filename).remove();
    }
}
