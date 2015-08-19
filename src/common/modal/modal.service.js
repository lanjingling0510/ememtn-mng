"use strict";

let angular = require("angular");
let jqLite = angular.element;

/**
 * @ngdoc service
 * @name commonModal
 * @module common.modal.service
 *
 */

module.exports = angular.module("common.modal.service", [])
    .factory("commonModal", commonModal);

/* @ngInject*/
function commonModal($q, $document, $compile, $rootScope) {
    return {
        fromTemplateUrl: fromTemplateUrl
    };

    /**
     * @ngdoc method
     * @param url
     * @param options
     * @name fromTemplateUrl
     * @desc add a modal in document return a promise object
     */
    function fromTemplateUrl(url, options) {
        var defer = $q.defer();
        createModal(url, options, defer);
        return defer.promise;
    }

    /**
     * @ngdoc method
     * @param url
     * @param options
     * @param defer
     */
    function createModal(url, options, defer) {
        // Create a new scope for the modal
        var scope = options.scope && options.scope.$new() || $rootScope.$new(true);
        var element = $compile(require(url))(scope);
        var modal = new Modal(element, scope, $document);
        defer.resolve(modal);
    }
}

/**
 * @ngdoc constructor
 * @param element
 * @param scope
 * @param parent
 *
 */
function Modal(element, scope, parent) {
    this.element = element;
    this.scope = scope;
    this.parent = parent;
    this._init();
}

Modal.prototype = {
    _init: _init,
    show: show,
    hide: hide
};

function _init() {
    var self = this;
    self.parent[0].body.appendChild(self.element[0]);
}

function show() {
    var self = this;
    var element = self.element;
    jqLite(element[0].querySelector('.modal-header .close')).on('click', function () {
        self.hide();
    });
    element.css('display', 'block');
    setTimeout(function () {
        element.addClass('in');
    }, 100);
}

function hide() {
    var self = this;
    var element = self.element;
    element.removeClass('in');
    setTimeout(function () {
        element.css('display', 'none');
    }, 100);
}

