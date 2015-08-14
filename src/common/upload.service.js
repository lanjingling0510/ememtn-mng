'use strict';

/* global AMap*/
require('./common.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.common.services')
    .factory('UploadService', UploadService);

/* @ngInject */
function UploadService($rootScope, Upload) {
    return function (url, files, fileFieldName, fields, method='POST') {
        let upload = Upload.upload({
            url: url,
            file: files,
            method: method,
            headers: {'Authorization': 'Bearer ' + $rootScope.auth.accessToken},
            fileFormDataName: fileFieldName,
            fields: fields,
            sendFieldsAs: 'json'
        });
        return upload;
    };
}
