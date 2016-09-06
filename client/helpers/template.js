Template.registerHelper('disableIfAdmin', (userId) => {
  if (Meteor.userId() === userId) {
    return Roles.userIsInRole(userId, 'admin') ? "disabled" : "";
  }
});

Template.registerHelper('humanDate', (timestamp) => {
    return moment(timestamp).format("MMMM Do, YYYY");
});

Template.registerHelper('activeScenario', function () {
  return Scenarios.findOne({_id: Session.get('active_scenario')});
});

Template.registerHelper('isScenarioAuthor', function () {
  return Scenarios.find({ author: Meteor.userId(), _id: Session.get('active_scenario')}).count() === 1 ? true : false;
});

Template.registerHelper('isActiveScenario', function () {
  return Session.get('active_scenario') ? true : false;
});

Template.registerHelper('activeScenarioTitle', function(row_id) {
  return Session.get('active_scenario') === row_id ? 'Active Scenario' : '';
});

Template.registerHelper('activeScenarioHighlight', function(row_id) {
  return Session.get('active_scenario') === row_id ? 'active-scenario fa fa-toggle-on' : '';
});
