'use strict';

let angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('sanya.prize_types_create.service', [
    'sanya.common.services'
]).service('PrizeTypesCreateService', PrizeTypesCreateService);

/* @ngInject */
function PrizeTypesCreateService(UploadService) {
    let url = '/apis/prize-types';

    return {
        create: create
    };

    function create(icon, fields) {
        return UploadService(url, icon, 'icon', fields);
    }
}
