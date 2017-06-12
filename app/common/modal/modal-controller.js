'use strict';

angular.module('voyager.modal')
    .controller('vsModalCtrl', function ($scope, $uibModalInstance, model) {

        var vm = this;

        _.extend(vm, model);

        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });