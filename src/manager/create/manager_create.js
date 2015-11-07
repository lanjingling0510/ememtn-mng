require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.manager.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ManagerCreateController', ManagerCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('manager-create', {
        url: '/managers/_create',
        template: require('./manager_create.html'),
        controller: 'ManagerCreateController as vm',
    });
}

/* @ngInject */
function ManagerCreateController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('managers');
    vm.createManager = createManager;
    vm.setPassword = setPassword;

    function createManager(manager) {
        Attendant.post(manager).then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function setPassword(phone) {
        if (!phone) { return; }
        vm.manager.password = phone.slice(-6);
    }
}
