const angular = require('angular');
require('./register.service.js');

module.exports = angular.module('ememtn.admins.register', [
    'ui.router',
    'ememtn.admins.register.service',
]).config(moduleConfig)
    .controller('registerController', registerController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('admin_register', {
        url: '/admins/register',
        template: require('./register.html'),
        controller: 'registerController as scope',
    });
}

/* @ngInject */
function registerController(RegisterService, AlertService) {
    const scope = this;
    scope.registerClick = registerClick;

    initController();

    function registerClick(user) {
        RegisterService.register(user).$promise
        .then(() => {
            AlertService.success('注册成功！');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        scope.user = { };
    }
}
