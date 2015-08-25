require('./exhibition_area_inline_edit.less');
require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-area.inline-edit', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('ExhibitionAreaInlineEditController', ExhibitionAreaInlineEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-list.exhibition-area-inline-edit', {
        url: '/:exhibitionAreaId',
        template: require('./exhibition_area_inline_edit.html'),
        controller: 'ExhibitionAreaInlineEditController as vm',
    });
}

/* @ngInject */
function ExhibitionAreaInlineEditController($scope, Restangular, AlertService) {
    const vm = this;
    vm.setExhibitionArea = setExhibitionArea;

    function setExhibitionArea(exhibitionArea) {
        ExhibitionArea.doPUT(exhibitionArea, vm.map).then(() => {
            AlertService.success('设置成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
