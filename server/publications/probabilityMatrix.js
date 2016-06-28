Meteor.publish("probabilityMatrix", function (active_scenario) {
  check(active_scenario, String);
  const probabilityMatrix = ProbabilityMatrix.find({scenario_id: active_scenario});
  if (probabilityMatrix) return probabilityMatrix;
  else return this.ready();
});

Meteor.publish("probabilityMatrixUser", function (active_scenario) {
  check(active_scenario, String);
  const probabilityMatrixUser = ProbabilityMatrix.find({scenario_id: active_scenario, user_id: this.userId});
  if (probabilityMatrixUser) return probabilityMatrixUser;
  else return this.ready();
});