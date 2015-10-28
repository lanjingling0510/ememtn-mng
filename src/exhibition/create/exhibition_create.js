const angular = require('angular');

module.exports = angular.module('ememtn.exhibition.create', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitionCreateController', ExhibitionCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-create', {
        url: '/exhibitions/_create',
        template: require('./exhibition_create.html'),
        controller: 'ExhibitionCreateController as vm',
    });
}

/* @ngInject*/
function ExhibitionCreateController(Restangular, AlertService) {
    const vm = this;
    const Exhibition = Restangular.all('exhibitions');
    vm.query = {};
    vm.exhibition = {
        startAt: convertDate(new Date(), 'YYYY-MM-DD h:m'),
        endAt: convertDate(new Date(), 'YYYY-MM-DD h:m'),
    };
    vm.createExhibition = createExhibition;

    function pushExhibition(exhibition) {
        return Exhibition.one(exhibition._id).doPOST({}, 'push');
    }

    function convertDate(date, formate) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();


        return formate
            .replace(/Y+/, year)
            .replace(/M+/, month)
            .replace(/D+/, day)
            .replace(/h+/, hour)
            .replace(/m+/, minute)
            .replace(/s+/, second);
    }

    function createExhibition(exhibition) {
        Exhibition.post(exhibition).then(function (exh) {
            return pushExhibition(exh);
        }).then(function () {
            AlertService.success('开始推送');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
