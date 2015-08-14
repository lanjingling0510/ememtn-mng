'use strict';

require('../../common/directive.js');
require('../../common/service.js');
require('../../feedback_category/list/feedback_categories.service.js');
require('./feedbacks.service.js');
require('./feedbacks.less');
let angular = require('angular');

module.exports = angular.module('sanya.feedbacks', [
    'ui.router',
    'ngResource',
    'sanya.common.directives',
    'sanya.common.services',
    'sanya.feedback_categories.service',
    'sanya.feedbacks.service'
]).config(moduleConfig)
    .controller('FeedbacksController', FeedbacksController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('feedbacks', {
        url: '/feedbacks',
        template: require('./feedbacks.html'),
        controller: 'FeedbacksController as scope'
    });
}

/* @ngInject */
function FeedbacksController($stateParams, FeedbackCategoriesService, FeedbacksService, AlertService) {
    let vm = this;
    vm.dealwithFeedback = dealwithFeedback;
    vm.fetchFeedbacks = fetchFeedbacks;

    vm.feedbackCategories = [];
    vm.querystring = {
        status: 'opening',
        feedbackCategoryId: '__all__',
        page: 1,
        pageSize: 15,
        total: 0
    };

    FeedbackCategoriesService.query().$promise.then(function (feedbackCategories) {
        feedbackCategories.unshift({
            _id: '__all__',
            name: '--- 全部 ---'
        });
        vm.feedbackCategories = feedbackCategories;
        fetchFeedbacks(vm.querystring);
    }).catch(function (err) {
        AlertService.warning(err.data);
    });

    function dealwithFeedback(feedback) {
        FeedbacksService.markAsClosed({
            _id: feedback._id
        }).$promise.then(function () {
            feedback.status = 'closed';
            // vm.feedbacks.splice(index, 1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function fetchFeedbacks(filter) {
        FeedbacksService.query(filter).$promise
        .then(function (feedbacks) {
            vm.feedbacks = feedbacks.slice(1);
            vm.querystring.total = feedbacks[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
