(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('PatientDialogController', PatientDialogController);

    PatientDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Patient', 'ReferralSource', 'Queue'];

    function PatientDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Patient, ReferralSource, Queue) {
        var vm = this;
        vm.patient = entity;
        vm.referralsources = ReferralSource.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('manateeApp:patientUpdate', result);
            var newqueue = {};
            newqueue.team = null;
            newqueue.patient = result;
            newqueue.status = 'incoming';
            newqueue.timestampInitial=null;
            newqueue.timestampFinal=null;
            console.log(newqueue);
            Queue.save(newqueue, onSaveSuccess, onSaveError);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.patient.id !== null) {
                Patient.update(vm.patient, onSaveSuccess, onSaveError);
            } else {
                Patient.save(vm.patient, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.deadline = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
