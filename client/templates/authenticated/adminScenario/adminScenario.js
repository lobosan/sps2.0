Template.adminScenario.helpers({
    scenarioDetailsAdmin: function () {
        return Scenarios.findOne({_id: Session.get('active_scenario')});
    }
});

Template.objectivesScenarioList.helpers({
    objectivesScenarioAdmin: function () {
        return Objectives.find();
    }
});

Template.alternativesScenarioList.helpers({
    alternativesScenarioAdmin: function () {
        return Alternatives.find();
    }
});

Template.guestsScenarioList.helpers({
    guestsScenarioAdmin: function () {
        var activeScenario = Scenarios.findOne({_id: Session.get('active_scenario')});
        var guests_ids = [];
        var guests_complete_values = [];
        _.each(activeScenario.guests, function (guest) {
            guests_ids.push(guest.userid);
            guests_complete_values.push(guest.complete_values);
        });
        var participants_list = [];
        var participants = Meteor.users.find({_id: {$in: guests_ids}}).fetch();
        var guest = 0;
        _.each(participants, function (participant) {
            participants_list.push({
                username: participant.username,
                email: participant.emails[0].address,
                complete_values: guests_complete_values[guest]
            });
            guest++;
        });
        return participants_list;
    }
});

Template.adminScenario.events({
    'click #next-turn': function () {
        var activeScenario = Scenarios.findOne({_id: Session.get('active_scenario')});

        var complete_values = [];
        _.each(activeScenario.guests, function (guest) {
            complete_values.push(guest.complete_values);
        });

        var not_complete = _.contains(complete_values, 'No');

        if (not_complete && activeScenario.turn > 0) {
            toastr.options = {"timeOut": "7000", "progressBar": true};
            toastr.error('Some guests have not confirmed their evaluation, you can send them an email to ask them to do it', 'Evaluations not confirmed');
        } else {
            var numObj = Objectives.find({scenario_id: Session.get('active_scenario')}).count();
            var numAlt = Alternatives.find({scenario_id: Session.get('active_scenario')}).count();

            var author = [activeScenario.author];
            var guests = [];
            _.each(activeScenario.guests, function (guest) {
                guests.push(guest.userid);
            });

            var participants = 0;

            if (!(guests === undefined || guests === null))
                participants = author.concat(guests);
            else
                participants = author;

            if (numObj < 3 || numAlt < 3 || participants.length < 2) {
                toastr.options = {"timeOut": "7000", "progressBar": true};
                toastr.error('Minimum 3 objectives, 3 alternatives and 2 participants are required to start the evaluation', 'Requirements not met');
            } else if (activeScenario.turn < 1) {
                swal({
                        title: "Are you sure?",
                        text: "Please confirm that all the participants are registered in the scenario",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, I'm sure!",
                        closeOnConfirm: false
                    },
                    function () {
                        Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Started'}, $inc: {turn: 1}});

                        /*** Connectivity Matrix ***/
                        var arrayDiag = [];
                        for (var i = 0; i < numObj; i++) {
                            arrayDiag.push('x');
                        }
                        var diagMat = numeric.diag(arrayDiag);

                        var newMat = [];
                        for (var p = 0; p < participants.length; p++) {
                            for (var i = 0; i < diagMat.length; i++) {
                                newMat.push([
                                    Scenarios.findOne({_id: Session.get('active_scenario')})._id,
                                    Scenarios.findOne({_id: Session.get('active_scenario')}).turn,
                                    participants[p]
                                ].concat(diagMat[i]));
                            }
                        }

                        var conMat = [];
                        var orderIni = 1;

                        for (var i = 0; i < newMat.length; i++) {
                            conMat[i] = {};
                            conMat[i]['scenario_id'] = newMat[i][0];
                            conMat[i]['turn'] = newMat[i][1];
                            conMat[i]['user_id'] = newMat[i][2];
                            conMat[i]['created_at'] = i;
                            if (orderIni <= numObj) {
                                conMat[i]['order'] = orderIni;
                                orderIni++;
                            } else {
                                orderIni = 1;
                                conMat[i]['order'] = orderIni;
                                orderIni++;
                            }
                            for (var j = 1; j <= numObj; j++) {
                                conMat[i]['o' + j] = newMat[i][j + 2];
                            }
                        }
                        console.log(conMat);

                        _.each(conMat, function (doc) {
                            ConnectivityMatrix.insert(doc);
                        });
                        /*** End Connectivity Matrix ***/

                        /*** Probability Matrix ***/
                        var arrayMat = numeric.rep([numAlt, numObj], 0);

                        var newMatP = [];

                        for (var p = 0; p < participants.length; p++) {
                            for (var i = 0; i < arrayMat.length; i++) {
                                newMatP.push([
                                    Scenarios.findOne({_id: Session.get('active_scenario')})._id,
                                    Scenarios.findOne({_id: Session.get('active_scenario')}).turn,
                                    participants[p]
                                ].concat(arrayMat[i]));
                            }
                        }

                        var probMat = [];
                        orderIni = 1;

                        for (var i = 0; i < newMatP.length; i++) {
                            probMat[i] = {};
                            probMat[i]['scenario_id'] = newMatP[i][0];
                            probMat[i]['turn'] = newMatP[i][1];
                            probMat[i]['user_id'] = newMatP[i][2];
                            probMat[i]['created_at'] = i;
                            if (orderIni <= numAlt) {
                                probMat[i]['order'] = orderIni;
                                orderIni++;
                            } else {
                                orderIni = 1;
                                probMat[i]['order'] = orderIni;
                                orderIni++;
                            }
                            for (var j = 1; j <= numObj; j++) {
                                probMat[i]['p' + j] = newMatP[i][j + 2];
                            }
                        }

                        console.log(probMat);
                        _.each(probMat, function (doc) {
                            ProbabilityMatrix.insert(doc);
                        });
                        /*** End Probability Matrix ***/

                        Router.go('connectivity');
                        swal("Started!", "Your scenario has been started", "success");
                    }
                );
            } else if (activeScenario.turn >= 1) {
                /*** Update turn and list of guests ***/
                Scenarios.update({_id: Session.get('active_scenario')}, {$inc: {turn: 1}});

                var guests_ids = [];
                _.each(activeScenario.guests, function (guest) {
                    guests_ids.push(guest.userid);
                });

                Meteor.call('notifyNextTurn', activeScenario.name, activeScenario.description, guests_ids, function (error, response) {
                    if (error) {
                        toastr.options = {"timeOut": "6000", "progressBar": true};
                        toastr.error('Uh oh, something went wrong', 'ERROR');
                    } else {
                        toastr.options = {"timeOut": "6000", "progressBar": true};
                        toastr.success('All guests have been notified by email about the next turn', 'Notifications sent');
                    }
                });

                _.each(guests_ids, function (guest_id) {
                    Meteor.call('updateCompletedValues', Session.get('active_scenario'), guest_id, 'No');
                });
                /*** End update turn and list of guests ***/

                var previousTurn = activeScenario.turn;
                var objsPreviousTurns = Objectives.find({scenario_id: Session.get('active_scenario'), turn: {$lte: previousTurn}}).count();
                var altsPreviousTurns = Alternatives.find({scenario_id: Session.get('active_scenario'), turn: {$lte: previousTurn}}).count();
                var turn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
                var objsNextTurn = Objectives.find({scenario_id: Session.get('active_scenario'), turn: turn}).count();
                var altsNextTurn = Alternatives.find({scenario_id: Session.get('active_scenario'), turn: turn}).count();

                /*** Connectivity Matrix Other Turns ***/
                var conMatrix = ConnectivityMatrix.find({scenario_id: Session.get('active_scenario'), turn: previousTurn}, {sort: {created_at: 1}}).fetch();

                var order = 1;
                var created_at = ConnectivityMatrix.findOne({scenario_id: Session.get('active_scenario')}, {sort: {created_at: -1}}).created_at + 1;

                for (var c = 0; c < conMatrix.length; c++) {
                    conMatrix[c].turn++;
                    conMatrix[c].created_at = created_at;
                    conMatrix[c].order = order;
                    delete conMatrix[c]['_id'];
                    if (objsNextTurn > 0) {
                        var conNewDim = objsPreviousTurns + objsNextTurn;
                        for (j = objsPreviousTurns + 1; j <= conNewDim; j++) {
                            conMatrix[c]['o' + j] = 0;
                        }
                    }
                    ConnectivityMatrix.insert(conMatrix[c]);
                    order++;
                    created_at++;
                    if ((c + 1) % objsPreviousTurns == 0) {
                        for (var k = 0; k < objsNextTurn; k++) {
                            var temp = {};
                            temp['scenario_id'] = conMatrix[c]['scenario_id'];
                            temp['turn'] = conMatrix[c]['turn'];
                            temp['user_id'] = conMatrix[c]['user_id'];
                            temp['created_at'] = created_at;
                            temp['order'] = order;
                            for (var m = 1; m <= conNewDim; m++) {
                                if (order == m) {
                                    temp['o' + m] = 'x';
                                } else {
                                    temp['o' + m] = 0;
                                }
                            }
                            ConnectivityMatrix.insert(temp);
                            order++;
                            created_at++;
                        }
                        order = 1;
                    }
                }
                /*** End Connectivity Matrix Other Turns ***/

                /*** Probability Matrix Other Turns ***/
                var probMatrix = ProbabilityMatrix.find({scenario_id: Session.get('active_scenario'), turn: previousTurn}, {sort: {created_at: 1}}).fetch();

                order = 1;
                created_at = ProbabilityMatrix.findOne({scenario_id: Session.get('active_scenario')}, {sort: {created_at: -1}}).created_at + 1;

                for (c = 0; c < probMatrix.length; c++) {
                    probMatrix[c].turn++;
                    probMatrix[c].created_at = created_at;
                    probMatrix[c].order = order;
                    delete probMatrix[c]['_id'];
                    if (objsNextTurn > 0) {
                        var probNewDim = objsPreviousTurns + objsNextTurn;
                        for (j = objsPreviousTurns + 1; j <= probNewDim; j++) {
                            probMatrix[c]['p' + j] = 0;
                        }
                    }
                    ProbabilityMatrix.insert(probMatrix[c]);
                    order++;
                    created_at++;

                    if ((c + 1) % altsPreviousTurns == 0 && altsNextTurn > 0) {
                        for (k = 0; k < altsNextTurn; k++) {
                            probNewDim = objsPreviousTurns + objsNextTurn;
                            temp = {};
                            temp['scenario_id'] = probMatrix[c]['scenario_id'];
                            temp['turn'] = probMatrix[c]['turn'];
                            temp['user_id'] = probMatrix[c]['user_id'];
                            temp['created_at'] = created_at;
                            temp['order'] = order;
                            for (m = 1; m <= probNewDim; m++) {
                                temp['p' + m] = 0;
                            }
                            ProbabilityMatrix.insert(temp);
                            order++;
                            created_at++;
                        }
                        order = 1;
                    } else if ((c + 1) % altsPreviousTurns == 0) {
                        order = 1;
                    }
                }
                /*** End Probability Matrix Other Turns ***/

                Router.go('connectivity');
            }
        }
    },
    'click #finish-evaluation': function (evt) {
        evt.preventDefault();
        var activeScenario = Scenarios.findOne({_id: Session.get('active_scenario')});

        var complete_values = [];
        _.each(activeScenario.guests, function (guest) {
            complete_values.push(guest.complete_values);
        });

        var not_complete = _.contains(complete_values, 'No');

        console.log(complete_values.length);

        if (not_complete && activeScenario.turn > 0 || complete_values.length === 0) {
            toastr.options = {"timeOut": "7000", "progressBar": true};
            toastr.error('Some guests have not confirmed their evaluation, you can send them an email to ask them to do it', 'Evaluations not confirmed');
            return false;
        } else {
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to undo this operation",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, finish it!",
                    closeOnConfirm: false
                },
                function () {
                    Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Finished'}});
                    swal("Finished!", "Your scenario has been finished", "success");
                }
            );
        }
    }
});