const angular = require('angular');

module.exports = angular.module('ememtn.exhibition.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
    'common.collapse.directive',
]).config(moduleConfig)
    .controller('ExhibitionListController', ExhibitionListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-list', {
        url: '/exhibitions',
        template: require('./exhibition_list.html'),
        controller: 'ExhibitionListController as vm',
    });
}

/* @ngInject*/
function ExhibitionListController($q, Restangular, AlertService) {
    const vm = this;
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {};
    vm.toggleCheckAll = toggleCheckAll;
    vm.removeCheckedExhibitions = removeCheckedExhibitions;

    searchExhibitions(vm.query);

    function searchExhibitions(query) {
        vm.exhibitions = Exhibition.getList(query).$object;
    }

    function toggleCheckAll(checked) {
        vm.exhibitions.forEach((exhibition) => {
            exhibition._checked = checked;
        });
    }

    function getCheckedExhibitions() {
        return vm.exhibitions.filter(exh => exh._checked);
    }

    function removeExhibition(exhibition) {
        return exhibition.remove().then(() => {
            const index = vm.exhibitions.indexOf(exhibition);
            vm.exhibitions.splice(index, 1);
            return $q.resolve(true);
        });
    }

    function removeCheckedExhibitions() {
        const exhibitions = getCheckedExhibitions();
        const proms = exhibitions.map(removeExhibition);
        $q.all(proms).then(() => {
            AlertService.success('删除成功');
        }).catch(err => {
            AlertService.warning(err.data);
        });
    }
}
