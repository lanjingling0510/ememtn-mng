require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.attendant.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('AttendantCreateController', AttendantCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('attendant-list.attendant-create', {
        url: '/_create',
        template: require('./attendant_create.html'),
        controller: 'AttendantCreateController as vm',
    });
}

/* @ngInject */
function AttendantCreateController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('attendants');
    vm.createAttendant = createAttendant;
    vm.setPassword = setPassword;

    function createAttendant(attendant) {
        Attendant.post(attendant).then(function () {
            // vm.attendant = {};
            $scope.$emit('custom.attendant.created');
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function setPassword(phone) {
        if (!phone) { return; }
        vm.attendant.password = phone.slice(-6);
    }
}
