'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.feedback_edit.service', [
    'ngResource'
]).service('FeedbackEditService', FeedbackEditService);

/* @ngInject */
function FeedbackEditService($resource) {
    let url = '/apis/feedbacks/:feedbackId';
    return $resource(url, null, {
        dealwith: {
            method: 'PUT',
            params: {
                feedbackId: '@_id'
            }
        }
    });
}
