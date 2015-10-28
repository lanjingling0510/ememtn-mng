//require('./news_edit.less');
const angular = require('angular');

module.exports = angular.module('ememtn.news.edit', [
    'ui.router',
    'restangular',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('NewsEditController', NewsEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('news-edit', {
        url: '/news/:newsId',
        template: require('./news_edit.html'),
        controller: 'NewsEditController as vm',
    });
}

/* @ngInject */
function NewsEditController(AlertService, $stateParams, Restangular, UploadToTempService) {
    const vm = this;
    const News = Restangular.all('newses');
    vm.uploadFile = uploadFile;
    vm.deleteNewFile = deleteNewFile;
    vm.deleteOldFile = deleteOldFile;
    vm.submitNews = submitNews;

    fetchNews($stateParams.newsId);

    function fetchNews(newsId) {
        News.get(newsId).then((news) => {
            vm.news = news;
            vm.news.pictures.forEach((pic, index) => {
                vm.news.pictures[index].isOld = true;
            });
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

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

    function deleteOldFile(picture) {
        // const filename = picture.fileUrl.split('/').pop();
        const index = vm.news.pictures.indexOf(picture);
        vm.news.one('pictures', index).doDELETE().then(() => {
            vm.news.pictures.splice(index, 1);
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function submitNews(news) {
        news.put().then(() => {
            vm.news._saved = true;
            vm.news.pictures.forEach((pic) => {
                pic.isNew = false;
                pic.isOld = false;
            });
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }
}
