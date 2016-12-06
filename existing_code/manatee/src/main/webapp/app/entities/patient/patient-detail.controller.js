(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('PatientDetailController', PatientDetailController);

    PatientDetailController.$inject = ['$scope', '$rootScope','$stateParams', 'entity', 'Patient', 'ReferralSource', 'EntityAuditService'];

    function PatientDetailController($scope, $rootScope, $stateParams, entity, Patient, ReferralSource, EntityAuditService) {
        $scope.sortType     = 'order'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        var vm = this;
        vm.patient = entity;
        
        var unsubscribe = $rootScope.$on('manateeApp:patientUpdate', function(event, result) {
            vm.patient = result;
        });
        $scope.$on('$destroy', unsubscribe);

        $scope.loadPatientHistory = function() {
            EntityAuditService.findByEntity("com.fangzhou.manatee.domain.Queue", 9999).then(function (data) {
                var audits = data.map(function(it){
                    it.entityValue = JSON.parse(it.entityValue);
                    return it;
                });

                var array_records = [];
                for (var i in audits) {                
                    if(typeof audits[i] ==="object")
                        if ('id' in audits[i]) {
                            var entityValue = audits[i]['entityValue'];
                            console.log(entityValue);
                            if ('patient' in entityValue) {
                                if(entityValue['patient'] && typeof entityValue['patient'] === "object") {
                                    var patient = entityValue['patient'];
                                    var patient_id = patient['id']
                                    if (patient_id==entity['id']) {
                                        if(entityValue['team']) {
                                            var team = entityValue['team'];
                                            var datetime = entityValue['lastModifiedDate'];
                                            var tempDatetime = datetime.split("T");
                                            var tempDate = tempDatetime[0].split("-");
                                            var tempTime = tempDatetime[1].split(":");
                                            var monthNames = [
                                                "January", "February", "March",
                                                "April", "May", "June", "July",
                                                "August", "September", "October",
                                                "November", "December"
                                            ];
                                            var dateTime = tempDate[0].toString() + "/" + tempDate[1].toString() + "/" + tempDate[2].toString() + " " + ((tempTime[0] >= 12) ? (tempTime[0] - 12).toString() : (tempTime[0]).toString()) + ":" + tempTime[1] + ":" + tempTime[2].split(".")[0] + ((tempTime[0] >= 12) ? "PM": "AM");
                                            array_records.push({'order': array_records.length + 1,'teamId': team['id'], 'teamName': team['name'], 'lastModifiedDate': dateTime, 'lastModifiedBy': entityValue['lastModifiedBy'], 'action': audits[i]['action'], 'potentialDischarged': entityValue['status']});
                                        }
                                    }
                                }
                            }
                        }
                }  
                // console.log("vm.audits");
                // console.log(array_records);
                // console.log(entity);
                $scope.patientHistories = array_records;
            }, function(){
                // vm.loading = false;
            });
        }
        $scope.loadPatientHistory();

    }
})();
