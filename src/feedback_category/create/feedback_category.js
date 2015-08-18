'use strict';

require('../../common/service.js');
require('../list/feedback_categories.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.feedback_category', [
    'ui.router',
    'sanya.common.services',
    'sanya.feedback_categories.service'
]).config(moduleConfig)
    .controller('FeedbackCategoryCreateController', FeedbackCategoryCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('feedback-category-create', {
        url: '/feedback-categories/new',
        template: require('./feedback_category.html'),
        controller: 'FeedbackCategoryCreateController as scope'
    });
}

/* @ngInject */
function FeedbackCategoryCreateController(FeedbackCategoriesService, AlertService) {
    let vm = this;
    vm.saveFeedbackCategory = saveFeedbackCategory;

    function saveFeedbackCategory(feedbackCategory) {
        FeedbackCategoriesService.save(feedbackCategory).$promise.then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
