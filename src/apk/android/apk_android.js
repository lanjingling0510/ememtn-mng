const angular = require('angular');
const moment = require('moment');

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
        AndroidApp.doGET().then((android) => {
            android.updatedAt = moment(android.updatedAt).format('YYYY-MM-DD HH:mm');
            vm.app = android;
        });
    }

    function updateTheApp(app) {
        app.doPUT(app).then(() => {
            AlertService.success('保存成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
