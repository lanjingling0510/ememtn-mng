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
function ExhibitionListController($timeout, $q, Restangular, AlertService) {
    const vm = this;
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };
    vm.toggleCheckAll = toggleCheckAll;
    vm.removeCheckedExhibitions = removeCheckedExhibitions;
    vm.searchExhibitions = searchExhibitions;

    searchExhibitions(vm.query, 0);

    let searchTimer;
    function searchExhibitions(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        $timeout(() => {
            Exhibition.getList(query).then((exhibitions) => {
                vm.query.total = exhibitions[0];
                vm.exhibitions = exhibitions.slice(1);
            });
        }, delay);
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
