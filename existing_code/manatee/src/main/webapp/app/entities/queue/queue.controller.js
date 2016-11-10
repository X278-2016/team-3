(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QueueController', QueueController);

    QueueController.$inject = ['$scope', '$state', 'Queue', 'ChatService', 'Team', 'Staff', 'EntityAuditService'];

    function QueueController ($scope, $state, Queue, ChatService, Team, Staff, EntityAuditService) {
        var vm = this;
        $scope.queues = [];

        function get_max_for_today(one_team) {
            var weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            var d = new Date();
            var n = d.getDay();
            if (one_team[weekdays[n]])
                return one_team[weekdays[n]]
            else
                return one_team['maxPatients']
        }

        $scope.loadAll = function() {

            var arrayTeam = [];
            var arrayPatientTeam = [];
            var arrayPotentialDischargedPatient = [];
            Team.query(function(result) {
                for (var i in result) {                    
                    if(typeof result[i] ==="object")
                        if ('name' in result[i]) {
                            arrayTeam.push({'id':result[i]['id'], 'name': result[i]['name'], 'space': get_max_for_today(result[i]), 'progressbarid':'progressbar-'+result[i]['id'] });
                            // arrayTeam.push({'id':result[i]['id'], 'name': result[i]['name'], 'space': result[i]['maxPatients'], 'progressbarid':'progressbar-'+result[i]['id'] });
                            arrayPatientTeam.push([]);
                            // console.log(result[i]['name']);
                            // console.log(get_max_for_today(result[i]));
                        }
                }  
                
                Queue.query(function(result) {
                    for (var i in result) {
                        if(typeof result[i] ==="object")
                            if ('team' in result[i]) 
                                if ('name' in result[i]['team']) {
                                    for (var j in arrayTeam) {
                                        if (arrayTeam[j]['name'] ==result[i]['team']['name']) {
                                            var tmp = result[i];
                                            // console.log(tmp);
                                            // // check if name equals empty
                                            // if(tmp['patient'] && tmp['patient']['name']=='') {
                                            //     tmp['patient']['name']=' ';
                                            // }
                                            if (result[i]['timestampInitial']) {
                                                var initialDate = result[i]['timestampInitial'];
                                                tmp['timestampSince'] = new Date(initialDate).getTime();
                                            }
                                            if (result[i]['timestampFinal']) {
                                                var finalDate = result[i]['timestampFinal'];
                                                tmp['timestampDue'] = new Date(finalDate).getTime();
                                            } else {
                                                tmp['timestampDue'] = -1;
                                            }
                                            if (result[i]['status'] && result[i]['status']=="potentialdischarge") {
                                                tmp['status'] = 1;
                                                arrayPotentialDischargedPatient.push(tmp);
                                            } else {
                                                tmp['status'] = 0;
                                            }
                                            
                                            arrayPatientTeam[j].push(tmp);
                                        }
                                    }
                                }
                    }
                    for (var i in arrayTeam) {
                        // console.log(arrayTeam[i]['space']);
                        if (arrayTeam[i]['space']==null) {
                            arrayTeam[i]['occupation'] = 0;
                            arrayTeam[i]['progressbarText'] = arrayPatientTeam[i].length +"";
                        } else if (arrayTeam[i]['space']<0) {
                            arrayTeam[i]['occupation'] = 0;
                            arrayTeam[i]['progressbarText'] = arrayPatientTeam[i].length +"";
                        } else if (arrayTeam[i]['space']==0) {
                            arrayTeam[i]['occupation'] = 0;
                            arrayTeam[i]['progressbarText'] = arrayPatientTeam[i].length +"/0";
                        } else {
                            arrayTeam[i]['occupation'] = arrayPatientTeam[i].length/arrayTeam[i]['space'];
                            arrayTeam[i]['progressbarText'] = arrayPatientTeam[i].length +"/"+arrayTeam[i]['space'];
                        }
                    }
                    $scope.teams = arrayTeam;
                    $scope.arrayPatientTeam = arrayPatientTeam;
                    $scope.arrayPotentialDischargedPatient = arrayPotentialDischargedPatient;
                    
                });
            });
        };

        $scope.loadAll();

        $scope.addMessage = function(message) {
            ChatService.send("send test message");
        };

        ChatService.receive().then(null, null, function(message) {
            // console.log("receive test message");
            // refresh_queue_page(false);
            $scope.loadAll(function(result) {
                $scope.activateProgressBar();
            });
        });

        $scope.updateTeam = function(queueID, teamID) {
            console.log("queueID, teamID:"+ queueID+"|"+ teamID);
            Queue.get({id: queueID}, function(queueResult) {
                
                Team.get({id : teamID}, function(teamResult) {
                    // console.log(teamResult);
                    queueResult.team=teamResult;
                    queueResult.timestampInitial = new Date();
                    // console.log(queueResult);
                    Queue.update(queueResult, onSaveFinished);
                });
            });
        }
        $scope.updateStatus = function(queueID, status) {
            Queue.get({id: queueID}, function(queueResult) {
                queueResult.status=status;
                Queue.update(queueResult, onSaveFinished);
            });
        }

        var onSaveFinished = function () {
            $scope.addMessage();
        };

        $scope.activateJQueryUI = function() {
            activatejQueryUI();
        }
        $scope.activateProgressBar = function(barID, progressNum, progressText) {
            intialProgressbar('#'+barID, progressNum, progressText);
        }

        $scope.recoverFromPotentialDischarge = function(queueID) {
            Queue.get({id: queueID}, function(queueResult) {
                queueResult.status='';
                Queue.update(queueResult, onSaveFinished);
            });
        }
        $scope.removeFromPotentialDischarge = function(queueID) {
            console.log(queueID);
            Queue.delete({id: queueID},
                function () {
                    $scope.addMessage();
                });

            // Queue.get({
            //     id: queueID
            // }, function(result) {
            //     console.log(result);
            //     $scope.queue = result;
            //     $('#deleteQueueConfirmation').modal('show');
            // });
        };
        $scope.delete = function(id) {
            Queue.get({
                id: id
            }, function(result) {
                $scope.queue = result;
                $('#deleteQueueConfirmation').modal('show');
            });
        };
        
        $scope.showPopover_team = function(team) {
            if (team && "id" in team && team['id']) {
                var teamID = team['id'];
                var content_to_show = "";
                Team.get({id : teamID}, function(teamResult) {
                    content_to_show+="Team Name:\n - "+ teamResult['name']+"\nTeam Cap:\n - "+teamResult['maxPatients']+"\nTeam Members:\n";
                    console.log(teamResult);

                    Staff.query(function(result) {
                        for (var i in result) { 
                            if (typeof result[i] ==="object"  && 'team' in result[i] && result[i] && result[i]['team']['id']==teamID)
                                if("name" in result[i] && "role" in result[i] ) {
                                    content_to_show += " - Name: " + result[i]['name'] + " | Role:" + result[i]['role'];
                                }
                        }
                        $scope.popupContent = content_to_show;
                    });
                    $scope.popupContent = content_to_show;
                });
            }
            $scope.popoverIsVisible = true; 
        };

        $scope.showPopover_history = function(team) {
            if (team && "id" in team && team['id']) {
                var teamID = team['id'];
                var content_to_show = "";
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
                                if ('team' in entityValue) {
                                    if(typeof entityValue['team'] ==="object") {
                                        var new_team = entityValue['team'];
                                        var new_team_id = new_team[
                                        'id']
                                        if (new_team_id==teamID) {
                                            if('team' in entityValue) {
                                                var new_team = entityValue['team'];
                                                array_records.push({'teamId': new_team['id'], 'teamName': new_team['name'], 'lastModifiedDate': new_team['lastModifiedDate'], 'lastModifiedBy': new_team['lastModifiedBy'], 'action': audits[i]['action'], 'potentialDischarged': new_team['status']});
                                            }
                                        }
                                    }
                                }
                            }
                    }  
                    // console.log("vm.audits");
                    console.log(array_records);
                    // console.log(entity);
                    $scope.patientHistories = array_records;
                }, function(){
                    // vm.loading = false;
                });

                Team.get({id : teamID}, function(teamResult) {
                    content_to_show+="Team Name:\n - "+ teamResult['name']+"\nTeam Cap:\n - "+teamResult['maxPatients']+"\nTeam Members:\n";
                    console.log(teamResult);

                    Staff.query(function(result) {
                        for (var i in result) { 
                            if (typeof result[i] ==="object"  && 'team' in result[i] && result[i] && result[i]['team']['id']==teamID)
                                if("name" in result[i] && "role" in result[i] ) {
                                    content_to_show += " - Name: " + result[i]['name'] + " | Role:" + result[i]['role'];
                                }
                        }
                        $scope.popupContent = content_to_show;
                    });
                    $scope.popupContent = content_to_show;
                });
            }
            $scope.popoverIsVisible = true; 
        };

        $scope.hidePopover = function () {
          $scope.popoverIsVisible = false;
          $scope.popupContent = "";
        };
    }
})();
