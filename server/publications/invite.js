Meteor.publish('invite', function (token) {
  check(token, String);
  return Invitations.find({"token": token});
});

Meteor.publish('openInvitations', function () {
  return Invitations.find({}, {fields: {"email": 1, "role": 1, "date": 1}})
});
