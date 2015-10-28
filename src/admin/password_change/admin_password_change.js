const angular = require('angular');

module.exports = angular.module('ememtn.admins.password-change', [
    'ui.router',
]).config(moduleConfig)
    .controller('AdminPasswordChangeController', AdminPasswordChangeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('admin_password_change', {
        url: '/admins/password-change',
        template: require('./admin_password_change.html'),
        controller: 'AdminPasswordChangeController as vm',
    });
}

/* @ngInject */
function AdminPasswordChangeController(Restangular, $rootScope, AlertService) {
    const vm = this;
    const Admin = Restangular.all('admins');
    vm.changePassword = changePassword;

    function changePassword(password) {
        Admin.one($rootScope.auth.profile._id).doPUT(password, 'password').then(() => {
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
