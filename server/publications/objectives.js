Meteor.publish("objectiveList", function (active_scenario) {
  check(active_scenario, String);
  return Objectives.find({scenario_id: active_scenario});
});