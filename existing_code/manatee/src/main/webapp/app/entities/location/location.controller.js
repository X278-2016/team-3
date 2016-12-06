(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('LocationController', LocationController);

    LocationController.$inject = ['$scope', '$state', 'Location'];

    function LocationController ($scope, $state, Location) {
        var vm = this;
        vm.locations = [];
        vm.loadAll = function() {
            Location.query(function(result) {
                vm.locations = result;
            });
        };

        vm.loadAll();
        
    }
})();
