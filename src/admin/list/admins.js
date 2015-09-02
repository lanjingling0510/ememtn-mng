require('../../common/service.js');
require('./admins.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.admins', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.admins.service',
]).config(moduleConfig)
    .controller('AdminsController', AdminsController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('admins', {
        url: '/admins',
        template: require('./admins.html'),
        controller: 'AdminsController as scope',
    });
}

/* @ngInject */
function AdminsController($stateParams, AdminService, AlertService, $timeout) {
    const vm = this;
    vm.disableAdmin = disableAdmin;
    vm.enableAdmin = enableAdmin;
    vm.removeAdmin = removeAdmin;
    vm.fetchAdmin = fetchAdmin;
    vm.querystring = {
        status: 'enabled',
        page: 1,
        pageSize: 15,
        total: 0,
    };

    fetchAdmin(vm.querystring);

    function disableAdmin(admin) {
        AdminService.disable({ _id: admin._id }).$promise
        .then(function () {
            admin.status = 'disabled';
            AlertService.success('冻结成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableAdmin(admin) {
        AdminService.enable({ _id: admin._id }).$promise
        .then(function () {
            admin.status = 'enabled';
            AlertService.success('解冻成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeAdmin(admin, index) {
        AlertService.danger('确定要删除管理员')
        .then(function () {
            return         AdminService.remove({ adminId: admin._id }).$promise;
        }).then(function () {
            vm.admins.splice(index, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            if (err) { AlertService.warning(err.data); }
        });
    }

    let fetchTimer;
    function fetchAdmin(querystring = {}, delay = 0) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            AdminService.query(querystring).$promise
                .then(function (admins) {
                    vm.admins = admins;
                    vm.querystring.total = admins.length;
                }).catch(function (err) {
                    AlertService.warning(err.data);
                });
        }, delay);
    }
}
