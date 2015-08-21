const angular = require('angular');

module.exports = angular.module('ememtn.news.create', [
    'ui.router',
    'restangular',
    'sanya.common.services',
])
    .config(moduleConfig)
    .controller('NewsCreateController', NewsCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('news-create', {
        url: '/news/create',
        template: require('./news_create.html'),
        controller: 'NewsCreateController as vm',
    });
}

/* @ngInject */
function NewsCreateController(AlertService, UploadService) {
    const vm = this;
    vm.files = [];
    vm.uploadChange = uploadChange;
    vm.deleteFile = deleteFile;
    vm.submitNews = submitNews;
    vm.fields = {
        subject: '',
        content: '',
    };

    function uploadChange(file) {
        if (!file) return;
        if (vm.files.length === 6) {
            AlertService.warning('最多上传6张');
            return;
        }
        vm.files.push(file);
    }

    function deleteFile(file) {
        const index = vm.files.indexOf(file);
        vm.files.splice(index, 1);
    }

    function submitNews() {
        UploadService('/apis/newses', vm.files, 'pictures', vm.fields)
            .then(function () {
                vm.fields = {
                    subject: '',
                    content: '',
                };
                vm.files = [];
            }).catch((err) => {
                AlertService.warning(err.data);
            });
    }
}
