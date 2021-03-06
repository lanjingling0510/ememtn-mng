const angular = require('angular');

module.exports = angular.module('ememtn.news.create', [
    'ui.router',
    'restangular',
    'ememtn.common.services',
]).config(moduleConfig)
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
function NewsCreateController(AlertService, Restangular, UploadToTempService) {
    const vm = this;
    const News = Restangular.all('newses');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.submitNews = submitNews;
    vm.news = {
        pictures: [],
    };

    function uploadFile(files) {
        if (!files || files.length === 0) { return false; }
        UploadToTempService.upload(files).then((fileUrls) => { // eslint-disable-line new-cap
            const pictures = fileUrls.map(function (fileUrl) {
                return {
                    fileUrl: fileUrl,
                    description: '',
                    isNew: true,
                };
            });
            vm.news.pictures = vm.news.pictures.concat(pictures);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function deleteNewFile(picture, index) {
        const filename = picture.fileUrl.split('/').pop();
        UploadToTempService.remove(filename).then(() => {
            vm.news.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function submitNews(news) {
        News.post(news).then(() => {
            vm.news._saved = true;
            vm.news.pictures.forEach((pic) => {
                pic.isNew = false;
            });
            AlertService.success('发布成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
