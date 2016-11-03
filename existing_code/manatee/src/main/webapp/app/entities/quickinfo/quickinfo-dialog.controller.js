(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QuickinfoDialogController', QuickinfoDialogController);

    QuickinfoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Quickinfo', 'Patient'];

    function QuickinfoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Quickinfo, Patient) {
        var vm = this;
        vm.quickinfo = entity;
        vm.patients = Patient.query({filter: 'quickinfo-is-null'});
        $q.all([vm.quickinfo.$promise, vm.patients.$promise]).then(function() {
            if (!vm.quickinfo.patient || !vm.quickinfo.patient.id) {
                return $q.reject();
            }
            return Patient.get({id : vm.quickinfo.patient.id}).$promise;
        }).then(function(patient) {
            vm.patients.push(patient);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('manateeApp:quickinfoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.quickinfo.id !== null) {
                Quickinfo.update(vm.quickinfo, onSaveSuccess, onSaveError);
            } else {
                Quickinfo.save(vm.quickinfo, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
