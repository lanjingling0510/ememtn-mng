'use strict';

let angular = require('angular');
require('../../common/service.js');
require('../list/feedback_categories.service.js');

module.exports = angular.module('sanya.feedback_categories_edit', [
    'ui.router',
    'sanya.common.services',
    'sanya.feedback_categories.service'
]).config(moduleConfig)
    .controller('FeedbackCategoryEditController', FeedbackCategoryEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('feedback-category-edit', {
        url: '/feedback-categories/:feedbackCategoryId',
        template: require('./categories_edit.html'),
        controller: 'FeedbackCategoryEditController as scope'
    });
}

/* @ngInject */
function FeedbackCategoryEditController($stateParams, AlertService, FeedbackCategoriesService) {
    const vm = this;
    vm.updateCategories = updateCategories;

    initController();

    function initController() {
        FeedbackCategoriesService.get({
            feedbackCategoryId: $stateParams.feedbackCategoryId
        }).$promise.then(function (data) {
            vm.feedbackCategory = data;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function updateCategories(feedbackCategory) {
        FeedbackCategoriesService.update({
            _id: feedbackCategory._id,
            name: feedbackCategory.name
        }).$promise.then(function() {
            AlertService.success("修改成功!");
        }).catch(function(err) {
            AlertService.warning(err.data);
        });
    }
}
