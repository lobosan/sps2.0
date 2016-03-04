Meteor.publish('scenarioList', function () {
  return Scenarios.find({});
});