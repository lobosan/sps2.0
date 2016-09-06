Meteor.publish("alternativeList", function (active_scenario) {
  check(active_scenario, String);
  return Alternatives.find({scenario_id: active_scenario}, {sort: {turn: 1, name: 1}});
});