Meteor.publish("probabilityMatrix", function (active_scenario) {
    return ProbabilityMatrix.find({scenario_id: active_scenario});
});