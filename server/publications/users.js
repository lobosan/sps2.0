Meteor.publish('users', function () {
  let isAdmin = Roles.userIsInRole(this.userId, ['admin', 'public', 'private']);

  if (isAdmin) {
    return [
      Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1, "roles": 1}})
    ];
  } else {
    return null;
  }
});

Meteor.publish('participants', function () {
  const participants = Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1}});
  if (participants) return participants;
  else return this.ready();
});

Meteor.publish("actorList", function () {
  const actorList = Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1}});
  if (actorList) return actorList;
  else return this.ready();
});