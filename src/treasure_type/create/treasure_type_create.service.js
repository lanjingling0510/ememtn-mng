const angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('ememtn.treasure_types_create.service', [
    'ememtn.common.services',
]).service('TreasureTypesCreateService', TreasureTypesCreateService);

/* @ngInject */
function TreasureTypesCreateService(UploadService) {
    const url = '/apis/treasure-types';

    return {
        create: create,
    };

    function create(icon, fields) {
        return UploadService(url, icon, 'icon', fields); // eslint-disable-line new-cap
    }
}
