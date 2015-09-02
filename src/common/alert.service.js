require('./common.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.common.services')
    .factory('AlertService', AlertService);

/* @ngInject */
function AlertService($rootScope, $q, $modal) {
    return {
        success: success,
        info: info,
        warning: warning,
        danger: danger,
        confirm: confirm,
    };

    function modal(texts, options) {
        $rootScope.modal = {
            texts: texts,
        };

        $rootScope.modal.actions = {
            close: closeModal,
            dismiss: dismissModal,
        };

        options.animation = true;
        options.template = require('./modal.html');
        const modalInstance = $modal.open(options);
        return modalInstance.result;

        function closeModal() {
            modalInstance.close(true);
        }

        function dismissModal() {
            modalInstance.dismiss(false);
        }
    }

    function success(content) {
        const texts = {
            title: '成功',
            body: content,
            closeButton: '确定',
            noDismiss: true,
        };

        const options = {
            backdrop: false,
        };

        return modal(texts, options);
    }

    function info(content) {
        const texts = {
            title: '提示',
            body: content,
            closeButton: '确定',
            noDismiss: true,
        };
        const options = {
            backdrop: false,
        };
        return modal(texts, options);
    }

    function warning(content) {
        const texts = {
            title: '警告',
            body: content,
            closeButton: '确认',
            dismissButton: '关闭',
            noDismiss: false,
        };
        const options = {
            backdrop: 'static',
            keyboard: false,
        };
        return modal(texts, options);
    }

    function danger(content) {
        const texts = {
            title: '危险',
            body: content,
            closeButton: '我了解',
            dismissButton: '取消',
            noDismiss: false,
        };
        const options = {
            backdrop: 'static',
            keyboard: false,
        };
        return modal(texts, options);
    }

    function confirm(content) {
        const texts = {
            title: '你确定吗？',
            body: content,
            closeButton: '我确定',
            dismissButton: '再想想',
            noDismiss: false,
        };
        const options = {
            backdrop: 'static',
            keyboard: false,
        };
        return modal(texts, options);
    }
}
