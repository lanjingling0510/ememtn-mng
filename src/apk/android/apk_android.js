const angular = require('angular');

module.exports = angular.module('ememtn.apk.android', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ApkandroidController', ApkandroidController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('apk-android', {
        url: '/apk/android',
        template: require('./apk_android.html'),
        controller: 'ApkandroidController as vm',
    });
}

/* @ngInject */
function ApkandroidController(Restangular, AlertService) {
    const vm = this;
    const AndroidApp = Restangular.all('mobile-apps').one('android');
    vm.updateTheApp = updateTheApp;

    fetchTheApp();

    function fetchTheApp() {
        vm.app = AndroidApp.doGET().$object;
    }

    function updateTheApp(app) {
        app.doPUT(app).then(() => {
            AlertService.success('保存成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
