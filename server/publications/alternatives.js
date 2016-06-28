Meteor.publish("alternativeList", function (active_scenario) {
  check(active_scenario, String);
  const alternativeList = Alternatives.find({scenario_id: active_scenario});
  if (alternativeList) return alternativeList;
  else return this.ready();
});