'use strict';

angular.module('voyager.modal').
factory('vsModalService', function($uibModal) {
    function _showModal(title, message, buttonText, cancelText) {

        buttonText = buttonText || 'OK';
        var modal = $uibModal.open({
            templateUrl: 'common/modal/info-modal.html',
            controller: 'vsModalCtrl as vm',
            resolve: {
                model: function () {
                    return {
                        title: title,
                        message: message,
                        buttonText: buttonText,
                        cancelText: cancelText
                    };
                }
            }
        });

        return modal.result.then(function () {
            return true;
        }, function () {
            return false;
        });
    }

    return {
        showModal: _showModal
    };
});