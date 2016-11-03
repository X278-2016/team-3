(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QuickinfoDetailController', QuickinfoDetailController);

    QuickinfoDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Quickinfo', 'Patient'];

    function QuickinfoDetailController($scope, $rootScope, $stateParams, entity, Quickinfo, Patient) {
        var vm = this;
        vm.quickinfo = entity;
        
        var unsubscribe = $rootScope.$on('manateeApp:quickinfoUpdate', function(event, result) {
            vm.quickinfo = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
