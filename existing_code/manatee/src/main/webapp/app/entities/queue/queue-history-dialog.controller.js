(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QueueHistoryDialogController', QueueHistoryDialogController);

    QueueHistoryDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity','Queue','EntityAuditService'];

    function QueueHistoryDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Queue, EntityAuditService) {
        var vm = this;
        // vm.queue = entity;
        // vm.patient = entity;
        // vm.referralsources = ReferralSource.query();

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.loadTeamHistory = function() {
            EntityAuditService.findByCurrentDay().then(function (data) {
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
                            if ('team' in entityValue) {
                                if(typeof entityValue['team'] ==="object") {
                                    // var team = entityValue['team'];
                                    // var team_id = team[
                                    // 'id']
                                    // if (team_id==entity['id']) {
                                        if('patient' in entityValue) {
                                            var patient = entityValue['patient'];
                                            array_records.push({'patientId': patient['id'], 'patientName': patient['name'], 'lastModifiedDate': entityValue['lastModifiedDate'], 'lastModifiedBy': entityValue['lastModifiedBy'], 'action': audits[i]['action'], 'potentialDischarged': entityValue['status']});
                                        }
                                    // }
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
        $scope.loadTeamHistory();
    }
})();
