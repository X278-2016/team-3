(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('CheckInDialogController', CheckInDialogController);

    CheckInDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'CheckIn', 'Patient', 'Location'];

    function CheckInDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, CheckIn, Patient, Location) {
        var vm = this;
        vm.checkIn = entity;
        vm.patients = Patient.query();
        vm.locations = Location.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('manateeApp:checkInUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.checkIn.id !== null) {
                CheckIn.update(vm.checkIn, onSaveSuccess, onSaveError);
            } else {
                CheckIn.save(vm.checkIn, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.timestamp = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
