require('../../common/directive.js');
require('../../common/service.js');
require('./feedback_list.less');
const angular = require('angular');

module.exports = angular.module('ememtn.feedback.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('FeedbackListController', FeedbackListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('feedback-list', {
        url: '/feedbacks',
        template: require('./feedback_list.html'),
        controller: 'FeedbackListController as vm',
    });
}

/* @ngInject */
function FeedbackListController($q, Restangular, AlertService) {
    const vm = this;
    const Feedback = Restangular.all('feedbacks');
    vm.searchFeedbacks = searchFeedbacks;
    vm.removeFeedback = removeFeedback;
    vm.removeCheckedFeedbacks = removeCheckedFeedbacks;
    vm.querystring = {
        status: 'opening',
        feedbackCategoryId: '__all__',
        page: 1,
        pageSize: 15,
        total: 0,
    };

    searchFeedbacks(vm.querystring);

    function searchFeedbacks(query) {
        Feedback.getList(query).then(function (feedbacks) {
            vm.feedbacks = feedbacks.slice(1);
            vm.querystring.total = feedbacks[0];
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function getCheckedFeedbacks() {
        return vm.feedbacks.filter((feedback) => feedback._checked);
    }

    function removeFeedback(feedback) {
        feedback.remove().then(function () {
            const index = vm.feedbacks.indexOf(feedback);
            vm.feedbacks.splice(index, 1);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function removeCheckedFeedbacks() {
        const checkedFeedbacks = getCheckedFeedbacks();
        const proms = checkedFeedbacks.map((feedback) => {
            return feedback.remove();
        });
        $q.all(proms).then(function () {
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
