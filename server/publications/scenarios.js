Meteor.publish('scenarioList', function () {
  const scenarioList = Scenarios.find({});
  if (scenarioList) return scenarioList;
  else return this.ready();
});

Meteor.publish('activeScenario', function (active_scenario) {
  check(active_scenario, String);
  const activeScenario = Scenarios.find({_id: active_scenario});
  if (activeScenario) return activeScenario;
  else return this.ready();
});