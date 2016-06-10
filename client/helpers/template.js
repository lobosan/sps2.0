Template.registerHelper('isCurrentUser', (currentUser) => {
  return currentUser === Meteor.userId() ? true : false;
});

Template.registerHelper('disableIfAdmin', (userId) => {
  if (Meteor.userId() === userId) {
    return Roles.userIsInRole(userId, 'admin') ? "disabled" : "";
  }
});

Template.registerHelper('selected', (v1, v2) => {
  return v1 === v2 ? true : false;
});

Template.registerHelper('humanDate', (timestamp) => {
  if (timestamp) {
    return moment(timestamp).format("MMMM Do, YYYY");
  }
});

Template.registerHelper('formatTime', function (context, options) {
  if (context)
    return moment(context).format('DD/MM/YYYY');
});

Template.registerHelper('activeScenario', function () {
  return Scenarios.findOne({_id: Session.get('active_scenario')});
});

Template.registerHelper('isScenarioAuthor', function () {
  if (Scenarios.find({ author: Meteor.userId(), _id: Session.get('active_scenario')}).count() === 1)
    return true;
  else
    return false;
});

Template.registerHelper('isActiveScenario', function () {
  if (! (Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('equal', function(val1, val2) {
  return val1 === val2 ? true : false;
});

Template.registerHelper('notEqual', function(val1, val2) {
  return val1 !== val2 ? true : false;
});

Template.registerHelper('activeScenarioTitle', function(row_id) {
  return Session.get('active_scenario') === row_id ? 'Active Scenario' : '';
});

Template.registerHelper('activeScenarioHighlight', function(row_id) {
  return Session.get('active_scenario') === row_id ? 'active-scenario fa fa-toggle-on' : '';
});
