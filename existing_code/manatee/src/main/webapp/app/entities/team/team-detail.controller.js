(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('TeamDetailController', TeamDetailController);

    TeamDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Team', 'EntityAuditService'];

    function TeamDetailController($scope, $rootScope, $stateParams, entity, Team, EntityAuditService) {
        var vm = this;
        vm.team = entity;
        
        var unsubscribe = $rootScope.$on('manateeApp:teamUpdate', function(event, result) {
            vm.team = result;
        });
        $scope.$on('$destroy', unsubscribe);

        $scope.loadTeamHistory = function() {
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
                            if ('team' in entityValue) {
                                if(typeof entityValue['team'] ==="object") {
                                    var team = entityValue['team'];
                                    if (team && 'id' in team) {
                                        var team_id = team[
                                        'id']
                                        if (team_id==entity['id']) {
                                            if('patient' in entityValue) {
                                                var patient = entityValue['patient'];
                                                array_records.push({'patientId': patient['id'], 'patientName': patient['name'], 'lastModifiedDate': entityValue['lastModifiedDate'], 'lastModifiedBy': entityValue['lastModifiedBy'], 'action': audits[i]['action'], 'potentialDischarged': entityValue['status']});
                                            }
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
        $scope.loadTeamHistory();
    }
})();
