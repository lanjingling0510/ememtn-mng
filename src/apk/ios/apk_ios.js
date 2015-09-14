const angular = require('angular');

module.exports = angular.module('ememtn.apk.ios', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ApkIosController', ApkIosController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('apk-ios', {
        url: '/apk/ios',
        template: require('./apk_ios.html'),
        controller: 'ApkIosController as vm',
    });
}

/* @ngInject */
function ApkIosController(Restangular, AlertService) {
    const vm = this;
    const iOSApp = Restangular.all('mobile-apps').one('ios');
    vm.updateTheApp = updateTheApp;

    fetchTheApp();

    function fetchTheApp() {
        vm.app = iOSApp.doGET().$object;
    }

    function updateTheApp(app) {
        app.doPUT(app).then(() => {
            AlertService.success('保存成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
