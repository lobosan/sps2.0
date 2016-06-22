Meteor.methods({
  sendInvitation(invitation) {
    check(invitation, {
      authorId: String,
      userName: String,
      email: String,
      role: String
    });

    try {
      Modules.server.sendInvitation({
        authorId: invitation.authorId,
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
