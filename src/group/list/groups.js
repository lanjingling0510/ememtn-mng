'use strict';

require('../../common/service.js');
require('./groups.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.groups', [
    'ui.router',
    'sanya.common.services',
    'sanya.groups.service'
]).config(moduleConfig)
    .controller('GroupsController', GroupsController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('groups', {
        url: '/groups',
        template: require('./groups.html'),
        controller: 'GroupsController as scope'
    });
}

/* @ngInject */
function GroupsController($stateParams, GroupsService, AlertService) {
    let vm = this;

    vm.disbandGroup = function disbandGroup(group) {
        GroupsService.remove({ groupId: group._id }).$promise
        .then(function () {
            let groupIndex = -1;
            vm.groups.forEach(function (grp, index) {
                if (grp._id === group._id) {
                    groupIndex = index;
                }
            });
            vm.groups.splice(groupIndex, 1);
            AlertService.success('解散成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    };

    (function init() {
        GroupsService.query().$promise
        .then(function (groups) {
            vm.groups = groups;
        });
    }());
}
