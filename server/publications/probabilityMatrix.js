Meteor.publish("probabilityMatrix", function (active_scenario) {
  check(active_scenario, String);
  return ProbabilityMatrix.find({scenario_id: active_scenario});
});

Meteor.publish("probabilityMatrixUser", function (active_scenario) {
  check(active_scenario, String);
  return ProbabilityMatrix.find({scenario_id: active_scenario, user_id: this.userId});
});