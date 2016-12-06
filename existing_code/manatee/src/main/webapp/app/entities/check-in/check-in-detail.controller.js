(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('CheckInDetailController', CheckInDetailController);

    CheckInDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'CheckIn', 'Patient', 'Location'];

    function CheckInDetailController($scope, $rootScope, $stateParams, entity, CheckIn, Patient, Location) {
        var vm = this;
        vm.checkIn = entity;
        
        var unsubscribe = $rootScope.$on('manateeApp:checkInUpdate', function(event, result) {
            vm.checkIn = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
