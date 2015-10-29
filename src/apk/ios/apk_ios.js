const angular = require('angular');
const moment = require('moment');

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
        iOSApp.doGET().then((ios) => {
            ios.updatedAt = moment(ios.updatedAt).format('YYYY-MM-DD HH:mm');
            vm.app = ios;
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
