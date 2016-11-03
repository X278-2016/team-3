(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QuickinfoController', QuickinfoController);

    QuickinfoController.$inject = ['$scope', '$state', 'Quickinfo'];

    function QuickinfoController ($scope, $state, Quickinfo) {
        var vm = this;
        vm.quickinfos = [];
        vm.loadAll = function() {
            Quickinfo.query(function(result) {
                vm.quickinfos = result;
            });
        };

        vm.loadAll();
        
    }
})();
