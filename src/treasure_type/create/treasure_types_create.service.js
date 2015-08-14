'use strict';

let angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('sanya.treasure_types_create.service', [
    'sanya.common.services'
]).service('TreasureTypesCreateService', TreasureTypesCreateService);

/* @ngInject */
function TreasureTypesCreateService(UploadService) {
    let url = '/apis/treasure-types';

    return {
        create: create
    };

    function create(icon, fields) {
        return UploadService(url, icon, 'icon', fields);
    }
}
