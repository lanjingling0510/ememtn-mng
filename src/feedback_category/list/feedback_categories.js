'use strict';

require('../../common/service.js');
require('./feedback_categories.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.feedback_categories', [
    'ui.router',
    'sanya.common.services',
    'sanya.feedback_categories.service'
]).config(moduleConfig)
    .controller('FeedbackCategoriesController', FeedbackCategoriesController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('feedback-category-list', {
            url: '/feedback-categories',
            template: require('./feedback_categories.html'),
            controller: 'FeedbackCategoriesController as scope'
        });
}

/* @ngInject */
function FeedbackCategoriesController($timeout, $stateParams, FeedbackCategoriesService, AlertService) {
    let vm = this;
    vm.enableFeedbackCategory = enableFeedbackCategory;
    vm.disableFeedbackCategory = disableFeedbackCategory;
    vm.removeFeedbackCategory = removeFeedbackCategory;
    vm.fetchFeedbackCategories = fetchFeedbackCategories;
    vm.querystring = {
        status: 'enabled'
    };
    fetchFeedbackCategories(vm.querystring);

    function enableFeedbackCategory(feedbackCategory) {
        FeedbackCategoriesService.enable({ _id: feedbackCategory._id }).$promise
        .then(function () {
            feedbackCategory.status = 'enabled';
            AlertService.success('冻结成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function disableFeedbackCategory(feedbackCategory) {
        FeedbackCategoriesService.disable({ _id: feedbackCategory._id }).$promise
        .then(function () {
            feedbackCategory.status = 'disabled';
            AlertService.success('冻结成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeFeedbackCategory(feedbackCategory) {
        FeedbackCategoriesService.remove({ _id: feedbackCategory._id }).$promise
        .then(function () {
            let feedbackCategoryIndex = -1;
            vm.feedbackCategories.forEach(function (cat, index) {
                if (cat._id === feedbackCategory._id) {
                    feedbackCategoryIndex = index;
                }
            });
            vm.feedbackCategories.splice(feedbackCategoryIndex, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    let fetchTimer;
    function fetchFeedbackCategories(querystring, delay=200) {
        $timeout.cancel(fetchTimer);
        fetchTimer = $timeout(function () {
            FeedbackCategoriesService.query(querystring).$promise.then(function (feedbackCategories) {
                vm.feedbackCategories = feedbackCategories;
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }
}
