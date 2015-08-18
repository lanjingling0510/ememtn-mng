'use strict';

let angular = require('angular');
require('../../common/service.js');

module.exports = angular.module('sanya.prize_types_edit.service', [
    'ngResource',
    'sanya.common.services'
]).service('PrizeTypesEditService', PrizeTypesEditService);

/* @ngInject */
function PrizeTypesEditService(UploadService, $resource) {
    let url = '/apis/prize-types';
    let basicRest = $resource(url + '/:prizeTypeId', null, {
        update: {
            method: 'PUT',
            params: {
                prizeTypeId: '@_id'
            }
        }
    });


    return {
        update: update,
        get: get
    };

    function update(icon, prizeType) {
        if (icon) {
            url = url + '/' + prizeType._id;
            return UploadService(url, icon, 'icon', prizeType, 'PUT');
        }
        return basicRest.update({ prizeTypeId: prizeType._id }, prizeType).$promise;
    }

    function get(cond) {
        return basicRest.get(cond);
    }
}
