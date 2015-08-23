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
        startAt: new Date(),
        endAt: new Date(),
    };
    vm.createExhibition = createExhibition;

    function pushExhibition(exhibition) {
        return Exhibition.one(exhibition._id).doPOST({}, 'push');
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
