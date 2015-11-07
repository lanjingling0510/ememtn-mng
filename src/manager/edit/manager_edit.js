require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.manager.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('ManagerEditController', ManagerEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('manager-edit', {
        url: '/managers/:managerId',
        template: require('./manager_edit.html'),
        controller: 'ManagerEditController as vm',
    });
}

/* @ngInject */
function ManagerEditController($timeout, $scope, $stateParams, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('managers');
    vm.updateManager = updateManager;

    Attendant.get($stateParams.managerId).then((manager) => {
        manager._scope = {};
        if (manager.scope.indexOf('news_editor') >= 0) {
            manager._scope.news_editor = true;
        }
        if (manager.scope.indexOf('censor') >= 0) {
            manager._scope.news_censor = true;
        }
        vm.manager = manager;
    }).catch((err) => {
        AlertService.warning(err.data);
    });

    function updateManager(manager) {
        manager.put().then(function () {
            AlertService.success('修改成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
