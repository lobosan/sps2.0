Meteor.publish('scenarioList', function () {
  return Scenarios.find({});
});

Meteor.publish('activeScenario', function (active_scenario) {
  check(active_scenario, String);
  return Scenarios.find({_id: active_scenario});
});