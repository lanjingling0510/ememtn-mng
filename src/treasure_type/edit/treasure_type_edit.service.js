'use strict';

let angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('sanya.treasure_types_edit.service', [
    'sanya.common.services'
]).service('TreasureTypeEditService', TreasureTypeEditService);

/* @ngInject */
function TreasureTypeEditService(UploadService, $resource) {
    let url = '/apis/treasure-types';
    let basicRest = $resource(url + '/:treasureTypeId', null, {
        update: {
            method: 'PUT',
            params: {
                treasureTypeId: '@_id'
            }
        }
    });


    return {
        update: update,
        get: get
    };

    function update(icon, treasureType) {
        if (icon) {
            url = url + '/' + treasureType._id;
            return UploadService(url, icon, 'icon', treasureType, 'PUT');
        }
        return basicRest.update({ treasureTypeId: treasureType._id }, treasureType).$promise;
    }

    function get(cond) {
        return basicRest.get(cond);
    }
}
