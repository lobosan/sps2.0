Meteor.publish('users', function () {
  let isAdmin = Roles.userIsInRole(this.userId, ['admin', 'public', 'private']);

  if (isAdmin) {
    return Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1, "roles": 1}});
  } else {
    return null;
  }
});

Meteor.publish('participants', function () {
  return Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1}});
});

Meteor.publish('author', function (active_scenario) {
  check(active_scenario, String);
  var scenario = Scenarios.findOne({_id: active_scenario});
  var author = scenario.author;
  return Meteor.users.find({_id: author}, {fields: {"roles": 1}});
});