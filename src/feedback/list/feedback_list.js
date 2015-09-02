require('../../common/directive.js');
require('../../common/service.js');
require('./feedback_list.less');
const angular = require('angular');

module.exports = angular.module('ememtn.feedback.list', [
    'ui.router',
    'ememtn.common.services',
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
function FeedbackListController($q, $timeout, Restangular, AlertService) {
    const vm = this;
    const Feedback = Restangular.all('feedbacks');
    vm.searchFeedbacks = searchFeedbacks;
    vm.removeFeedback = removeFeedback;
    vm.removeCheckedFeedbacks = removeCheckedFeedbacks;
    vm.toggleCheckAll = toggleCheckAll;
    vm.query = {
        status: 'opening',
        page: 1,
        pageSize: 15,
        total: 0,
    };

    searchFeedbacks(vm.query, 0);

    let searchTimer;
    function searchFeedbacks(query, delay=200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            Feedback.getList(query).then(function (feedbacks) {
                vm.query.total = feedbacks[0];
                vm.feedbacks = feedbacks.slice(1);
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function getCheckedFeedbacks() {
        return vm.feedbacks.filter((feedback) => feedback._checked);
    }

    function removeFeedback(feedback) {
        return feedback.remove().then(function () {
            const index = vm.feedbacks.indexOf(feedback);
            vm.feedbacks.splice(index, 1);
            $q.resolve(true);
        });
    }

    function removeCheckedFeedbacks() {
        const checkedFeedbacks = getCheckedFeedbacks();
        const proms = checkedFeedbacks.map(removeFeedback);
        $q.all(proms).then(function () {
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function toggleCheckAll(checked) {
        vm.feedbacks.forEach(fd => {
            fd._checked = checked;
        });
    }
}
