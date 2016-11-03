'use strict';

describe('Controller Tests', function() {

    describe('Quickinfo Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockQuickinfo, MockPatient;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockQuickinfo = jasmine.createSpy('MockQuickinfo');
            MockPatient = jasmine.createSpy('MockPatient');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Quickinfo': MockQuickinfo,
                'Patient': MockPatient
            };
            createController = function() {
                $injector.get('$controller')("QuickinfoDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'manateeApp:quickinfoUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
