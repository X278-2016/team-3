(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('LocationDeleteController',LocationDeleteController);

    LocationDeleteController.$inject = ['$uibModalInstance', 'entity', 'Location'];

    function LocationDeleteController($uibModalInstance, entity, Location) {
        var vm = this;
        vm.location = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Location.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
