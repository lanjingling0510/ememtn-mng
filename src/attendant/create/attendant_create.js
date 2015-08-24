require('../../common/service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.attendant.create', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('TouristCreateController', TouristCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('attendant-list.attendant-create', {
        url: '/_create',
        template: require('./attendant_create.html'),
        controller: 'TouristCreateController as vm',
    });
}

/* @ngInject */
function TouristCreateController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const Attendant = Restangular.all('attendants');
    vm.createAttendant = createAttendant;

    function createAttendant(attendant) {
        Attendant.post(attendant).then(function () {
            vm.attendant = {};
            $scope.$emit('custom.attendant.created');
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
