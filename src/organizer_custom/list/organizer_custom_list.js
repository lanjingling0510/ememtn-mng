const angular = require('angular');

module.exports = angular.module('ememtn.organizer-custom.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('OrganizerCustomListController', OrganizerCustomListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('organizer-custom-list', {
        url: '/organizer-customs',
        template: require('./organizer_custom_list.html'),
        controller: 'OrganizerCustomListController as vm',
    });
}

/* @ngInject*/
function OrganizerCustomListController(Restangular, AlertService) {
    const vm = this;
    const OrganizerCustom = Restangular.all('organizer-customs');
    vm.toggleCheckAll = toggleCheckAll;
    vm.stickyOrganizerCustom = stickyOrganizerCustom;
    vm.stickyOrganizerCustoms = stickyOrganizerCustoms;
    vm.deleteSelectedOrgCustoms = deleteSelectedOrgCustoms;

    searchOrganizerCustoms();

    function searchOrganizerCustoms(query={}) {
        vm.organizerCustoms = OrganizerCustom.getList(query).$object;
    }

    function toggleCheckAll(checked) {
        vm.organizerCustoms.forEach(function (organizerCustom) {
            organizerCustom._checked = checked;
        });
    }

    function getCheckedOrganizerCustoms() {
        return vm.organizerCustoms.filter((organizerCustom) => organizerCustom._checked);
    }

    function stickyOrganizerCustom(organizerCustom) {
        organizerCustom.one('sticky', 'yes').put().then(function () {
            organizerCustom.sticky = 1;
            organizerCustom.stickedAt = new Date().toISOString();
            organizerCustom.updatedAt = new Date().toISOString();
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function stickyOrganizerCustoms() {
        const checkedNewses = getCheckedOrganizerCustoms();
        checkedNewses.forEach(stickyOrganizerCustom);
    }

    function deleteOrgCustom(orgCustom) {
        orgCustom.remove().then(() => {
            const index = vm.organizerCustoms.indexOf(orgCustom);
            vm.organizerCustoms.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteSelectedOrgCustoms() {
        const checkedNewses = getCheckedOrganizerCustoms();
        checkedNewses.forEach(deleteOrgCustom);
    }
}
