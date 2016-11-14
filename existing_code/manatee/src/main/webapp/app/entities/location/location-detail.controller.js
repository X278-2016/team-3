(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('LocationDetailController', LocationDetailController);

    LocationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Location'];

    function LocationDetailController($scope, $rootScope, $stateParams, entity, Location) {
        var vm = this;
        vm.location = entity;
        
        var unsubscribe = $rootScope.$on('manateeApp:locationUpdate', function(event, result) {
            vm.location = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
