(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QuickinfoDeleteController',QuickinfoDeleteController);

    QuickinfoDeleteController.$inject = ['$uibModalInstance', 'entity', 'Quickinfo'];

    function QuickinfoDeleteController($uibModalInstance, entity, Quickinfo) {
        var vm = this;
        vm.quickinfo = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Quickinfo.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
