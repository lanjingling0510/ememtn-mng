const angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('ememtn.treasure_types_edit.service', [
    'ememtn.common.services',
]).service('TreasureTypeEditService', TreasureTypeEditService);

/* @ngInject */
function TreasureTypeEditService(UploadService, $resource) {
    const url = '/apis/treasure-types';
    const basicRest = $resource(url + '/:treasureTypeId', null, {
        update: {
            method: 'PUT',
            params: {
                treasureTypeId: '@_id',
            },
        },
    });


    return {
        update: update,
        get: get,
    };

    function update(icon, treasureType) {
        if (icon) {
            url = url + '/' + treasureType._id;
            return UploadService(url, icon, 'icon', treasureType, 'PUT'); // eslint-disable-line new-cap
        }
        return basicRest.update({ treasureTypeId: treasureType._id }, treasureType).$promise;
    }

    function get(cond) {
        return basicRest.get(cond);
    }
}
