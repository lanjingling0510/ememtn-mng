'use strict';

require('../../common/service.js');
require('./feedback_edit.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.feedback_edit', [
    'ui.router',
    'sanya.common.services',
    'sanya.feedback_edit.service'
]).config(moduleConfig)
    .controller('FeedbackEditController', FeedbackEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('feedback_edit', {
        url: '/feedbacks/:feedbackId',
        template: require('./feedback_edit.html'),
        controller: 'FeedbackEditController as scope'
    });
}

/* @ngInject */
function FeedbackEditController($stateParams, FeedbackEditService, AlertService) {
    let vm = this;
    vm.dealwithFeedback = dealwithFeedback;

    initController();

    function dealwithFeedback(feedback) {
        feedback.$dealwith()
        .then(function () {
            AlertService.success('保存成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        FeedbackEditService.get({
            feedbackId: $stateParams.feedbackId
        }).$promise
        .then(function (feedback) {
            vm.feedback = feedback;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
