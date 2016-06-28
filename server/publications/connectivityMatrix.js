Meteor.publish("connectivityMatrix", function (active_scenario) {
  check(active_scenario, String);
  const connectivityMatrix = ConnectivityMatrix.find({scenario_id: active_scenario});
  if (connectivityMatrix) return connectivityMatrix;
  else return this.ready();
});

Meteor.publish("connectivityMatrixUser", function (active_scenario) {
  check(active_scenario, String);
  const connectivityMatrixUser = ConnectivityMatrix.find({scenario_id: active_scenario, user_id: this.userId});
  if (connectivityMatrixUser) return connectivityMatrixUser;
  else return this.ready();
});