'use strict';

let angular = require('angular');

module.exports = angular.module('sanya.feedbacks.service', [
    'ngResource'
]).service('FeedbacksService', FeedbacksService);

/* @ngInject */
function FeedbacksService($resource) {
    let url = '/apis/feedbacks/:feedbackId';
    return $resource(url, null, {
        markAsClosed: {
            url: url + '/closing',
            method: 'PUT',
            params: {
                feedbackId: '@_id'
            }
        }
    });
}
