(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('CheckInDeleteController',CheckInDeleteController);

    CheckInDeleteController.$inject = ['$uibModalInstance', 'entity', 'CheckIn'];

    function CheckInDeleteController($uibModalInstance, entity, CheckIn) {
        var vm = this;
        vm.checkIn = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            CheckIn.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
