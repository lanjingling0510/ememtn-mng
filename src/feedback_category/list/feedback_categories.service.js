'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.feedback_categories.service', [
    'ngResource'
]).service('FeedbackCategoriesService', FeedbackCategoriesService);

/* @ngInject */
function FeedbackCategoriesService($resource) {
    let url = '/apis/feedback-categories/:feedbackCategoryId';
    return $resource(url, null, {
        update: {
            method: 'PUT',
            params: {
                feedbackCategoryId: '@_id'
            }
        },
        enable: {
            method: 'PUT',
            url: url + '/enablement',
            params: {
                feedbackCategoryId: '@_id'
            }
        },
        disable: {
            method: 'PUT',
            url: url + '/disablement',
            params: {
                feedbackCategoryId: '@_id'
            }
        }
    });
}
