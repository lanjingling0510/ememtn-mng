require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('UploadService', UploadService)
    .factory('UploadToTempService', UploadToTempService);

/* @ngInject */
function UploadService($rootScope, Upload) {
    return function (url, files, fileFieldName, fields, method='POST') {
        const upload = Upload.upload({
            url: url,
            file: files,
            method: method,
            headers: {'Authorization': 'Bearer ' + $rootScope.auth.accessToken},
            fileFormDataName: fileFieldName,
            fields: fields,
            sendFieldsAs: 'json',
        });
        return upload;
    };
}

/* @ngInject */
function UploadToTempService($q, $rootScope, Restangular, Upload) {
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
