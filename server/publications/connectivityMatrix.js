Meteor.publish("connectivityMatrix", function (active_scenario) {
  check(active_scenario, String);
  return ConnectivityMatrix.find({scenario_id: active_scenario});
});

Meteor.publish("connectivityMatrixUser", function (active_scenario) {
  check(active_scenario, String);
  return ConnectivityMatrix.find({scenario_id: active_scenario, user_id: this.userId});
});