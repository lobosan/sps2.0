Meteor.publish("objectiveList", function (active_scenario) {
  check(active_scenario, String);
  const objectiveList = Objectives.find({scenario_id: active_scenario});
  if (objectiveList) return objectiveList;
  else return this.ready();
});