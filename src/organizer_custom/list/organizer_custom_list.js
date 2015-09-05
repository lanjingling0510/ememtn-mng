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
function OrganizerCustomListController($timeout, Restangular, AlertService) {
    const vm = this;
    const OrganizerCustom = Restangular.all('organizer-customs');
    const VISIBLE = {
        YES: 1,
        NO: 0,
    };
    vm.toggleCheckAll = toggleCheckAll;
    vm.stickyOrganizerCustom = stickyOrganizerCustom;
    vm.stickySelectedOrganizerCustoms = stickySelectedOrganizerCustoms;
    vm.deleteSelectedOrgCustoms = deleteSelectedOrgCustoms;
    vm.saveCustomTitle = saveCustomTitle;
    vm.showSelectedOrgCustoms = showSelectedOrgCustoms;
    vm.hideSelectedOrgCustoms = hideSelectedOrgCustoms;
    vm.searchOrganizerCustoms = searchOrganizerCustoms;
    vm.toggleShowingAndHidden = toggleShowingAndHidden;
    vm.toggleShowing = toggleShowing;
    vm.toggleHidden = toggleHidden;
    vm.query = {};

    fetchOrganizer();
    searchOrganizerCustoms(vm.query, 0);

    let searchTimer;
    function searchOrganizerCustoms(query={}, delay=200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            vm.organizerCustoms = OrganizerCustom.getList(query).$object;
        }, delay);
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

    function stickySelectedOrganizerCustoms() {
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

    function fetchOrganizer() {
        vm.organizer = Restangular.all('organizer').doGET().$object;
    }

    function saveCustomTitle(title) {
        vm.organizer.doPUT({
            customSubject: title,
        }, 'custom-subject').then(() => {
            AlertService.success('保存成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function showOrgCustom(orgCustom) {
        orgCustom.all('visible').doPUT({}, 'yes').then(function () {
            orgCustom.visible = 1;
            orgCustom.updatedAt = new Date().toISOString();
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function showSelectedOrgCustoms() {
        const checkedOrgCustoms = getCheckedOrganizerCustoms();
        checkedOrgCustoms.forEach(showOrgCustom);
    }

    function hideOrgCustom(orgCustom) {
        orgCustom.all('visible').doPUT({}, 'no').then(function () {
            orgCustom.visible = 0;
            orgCustom.updatedAt = new Date().toISOString();
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function hideSelectedOrgCustoms() {
        const checkedOrgCustoms = getCheckedOrganizerCustoms();
        checkedOrgCustoms.forEach(hideOrgCustom);
    }

    function toggleShowingAndHidden() {
        delete vm.query.visible;
        searchOrganizerCustoms(vm.query);
    }

    function toggleShowing() {
        vm.query.visible = VISIBLE.YES;
        searchOrganizerCustoms(vm.query);
    }

    function toggleHidden() {
        vm.query.visible = VISIBLE.NO;
        searchOrganizerCustoms(vm.query);
    }
}
