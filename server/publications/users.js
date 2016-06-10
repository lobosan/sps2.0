Meteor.publish('users', function () {
  let isAdmin = Roles.userIsInRole(this.userId, 'admin');

  if (isAdmin) {
    return [
      Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1, "roles": 1}}),
    ];
  } else {
    return null;
  }
});
