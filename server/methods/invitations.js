Meteor.methods({
  sendInvitation(invitation) {
    check(invitation, {
      userName: String,
      email: String,
      role: String
    });

    try {
      Modules.server.sendInvitation({
        userName: invitation.userName,
        email: invitation.email,
        token: Random.hexString(16),
        role: invitation.role,
        date: ( new Date() ).toISOString()
      });
    } catch (exception) {
      return exception;
    }
  },
  revokeInvitation(inviteId) {
    check(inviteId, String);

    try {
      Invitations.remove(inviteId);
    } catch (exception) {
      return exception;
    }
  }
});
