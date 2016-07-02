let invitation = (options) => {
  var user = Meteor.users.findOne({'emails.address': options.email});
  if (user) {
    try {
      Modules.server.addUserToContactsList(user._id, options.authorId);
    } catch (exception) {
      return exception;
    }
  } else {
    var invitation = Invitations.findOne({email: options.email});
    var email;
    if (!invitation) {
      _insertInvitation(options);
      email = _prepareEmail(options.userName, options.authorId, options.token);
      _sendInvitation(options.email, email);
    }
  }
};

let _insertInvitation = (invite) => {
  Invitations.insert(invite);
};

let _prepareEmail = (userName, authorId, token) => {
  let domain = Meteor.settings.public.domain;
  let url = `http://${ domain }/invite/${ authorId }/${ token }`;

  SSR.compileTemplate('invitation', Assets.getText('email/templates/invitation.html'));
  let html = SSR.render('invitation', {url: url, userName: userName});

  return html;
};

let _sendInvitation = (email, content) => {
  Email.send({
    to: email,
    from: "Scenario Planning System <"+Meteor.user().emails[0].address+">",
    subject: "Invitation to participate in SPS",
    html: content
  });
};

Modules.server.sendInvitation = invitation;
