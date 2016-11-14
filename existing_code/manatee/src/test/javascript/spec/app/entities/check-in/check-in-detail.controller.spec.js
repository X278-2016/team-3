'use strict';

describe('Controller Tests', function() {

    describe('CheckIn Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockCheckIn, MockPatient, MockLocation;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockCheckIn = jasmine.createSpy('MockCheckIn');
            MockPatient = jasmine.createSpy('MockPatient');
            MockLocation = jasmine.createSpy('MockLocation');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'CheckIn': MockCheckIn,
                'Patient': MockPatient,
                'Location': MockLocation
            };
            createController = function() {
                $injector.get('$controller')("CheckInDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'manateeApp:checkInUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
