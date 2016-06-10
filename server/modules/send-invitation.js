let invitation = (options) => {
  _insertInvitation(options);
  var email = _prepareEmail(options.token);
  _sendInvitation(options.email, email);
};

let _insertInvitation = (invite) => {
  Invitations.insert(invite);
};

let _prepareEmail = (token) => {
  let domain = Meteor.settings.private.domain;
  let url = `http://${ domain }/invite/${ token }`;

  SSR.compileTemplate('invitation', Assets.getText('email/templates/invitation.html'));
  let html = SSR.render('invitation', {url: url});

  return html;
};

let _sendInvitation = (email, content) => {
  Email.send({
    to: email,
    from: "Scenario Planning System <sp.galindoh@gmail.com>",
    subject: "Invitation to SPS",
    html: content
  });
};

Modules.server.sendInvitation = invitation;
