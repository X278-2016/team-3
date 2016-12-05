(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('QueueController', QueueController);

    QueueController.$inject = ['$scope', '$state', 'Queue', 'ChatService', 'Team', 'Staff', 'EntityAuditService'];

    function QueueController ($scope, $state, Queue, ChatService, Team, Staff, EntityAuditService) {
        var vm = this;
        $scope.queues = [];

        $scope.gridsterOpts = {
            columns: 6, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [10, 10], // the pixel distance between each widget
            outerMargin: true, // whether margins apply to outer edges of the grid
            sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // the minimum columns the grid must have
            minRows: 2, // the minimum height of the grid, in rows
            maxRows: 100,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            minSizeX: 1, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 2, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            // resizable: {
            //    enabled: true,
            //    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            //    start: function(event, $element, widget) {}, // optional callback fired when resize is started,
            //    resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
            //    stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
            // },
            // draggable: {
            //    enabled: false, // whether dragging items is supported
               // handle: '.my-class', // optional selector for drag handle
               // start: function(event, $element, widget) {}, // optional callback fired when drag is started,
               // drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
               // stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
            // }
        };

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
                                if (result[i]['team']!==null && 'name' in result[i]['team']) {
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
                    var standardItems = [];
                    for (var i_team = 0; i_team < arrayPatientTeam.length; i_team++) { 
                        standardItems.push({row: Math.floor(i_team/3)*3, col: (i_team%3)*2});
                    }
                    $scope.standardItems = standardItems;
                    $( ".connectedSortable" ).sortable({
      connectWith: ".connectedSortable",
      items: "tr",
      opacity: 0.5,
      revert: 400,
      receive: function(event, ui) {
        var id = $(ui.item).attr('id');
        var teamID = this.id;
        if (id=="potentialdischarge-tr") {
          ui.sender.sortable("cancel");
          return;
        }
        if (teamID=="potentialdischarge") {
          ui.sender.sortable("cancel");
          $('#QueueController').scope().updateStatus(id, "potentialdischarge");
        } else {
          $('#QueueController').scope().updateTeam(id, teamID);
        }
        // console.log(id +"  receive: "+ teamID);
      },
    }).disableSelection();
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
