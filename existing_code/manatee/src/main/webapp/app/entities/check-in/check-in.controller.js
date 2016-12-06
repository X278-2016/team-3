(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('CheckInController', CheckInController);

    CheckInController.$inject = ['$scope', '$state', 'CheckIn'];

    function CheckInController ($scope, $state, CheckIn) {
        var vm = this;
        vm.checkIns = [];
        vm.loadAll = function() {
            CheckIn.query(function(result) {
                vm.checkIns = result;
            });
        };

        vm.loadAll();
        
    }
})();
