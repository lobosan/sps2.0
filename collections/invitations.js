Invitations = new Meteor.Collection('invitations');
SubsManagerInvitations = new SubsManager();

let InvitationsSchema = new SimpleSchema({
  authorId: {
    type: String,
    label: "Author id."
  },
  userName: {
    type: String,
    label: "User name."
  },
  email: {
    type: String,
    label: "Email to send invitation to."
  },
  token: {
    type: String,
    label: "Invitation token."
  },
  role: {
    type: String,
    label: "Role to apply to the user."
  },
  date: {
    type: String,
    label: "Invitation Date"
  }
});

Invitations.attachSchema(InvitationsSchema);
