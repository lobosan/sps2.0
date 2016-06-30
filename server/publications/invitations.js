Meteor.publish('invite', function (token) {
  check(token, String);
  const invite = Invitations.find({"token": token});
  if (invite) return invite;
  else return this.ready();
});

Meteor.publish('openInvitations', function () {
  const openInvitations = Invitations.find({}, {fields: {"email": 1, "role": 1, "date": 1, "authorId": 1}});
  if (openInvitations) return openInvitations;
  else return this.ready();
});
