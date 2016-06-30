let invitation = (options) => {
  var currentUsers = Meteor.users.find({}, {fields: {emails: 1}}).fetch();
  var contact;
  _.find(currentUsers, function (item) {
    if (item.emails[0].address === options.email) {
      contact = Meteor.users.findOne({'emails.address': options.email});
    }
  });
  if (contact) {
    try {
      Modules.server.addUserToContactsList(contact._id, options.authorId);
    } catch (exception) {
      return exception;
    }
  } else {
    _insertInvitation(options);
    var email = _prepareEmail(options.userName, options.authorId, options.token);
    _sendInvitation(options.email, email);
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
  this.unblock();

  if (!Meteor.user())
    throw new Meteor.Error(403, "not logged in");

  Email.send({
    to: email,
    from: Meteor.user().emails[0].address,
    subject: "Invitation to SPS",
    html: content
  });
};

Modules.server.sendInvitation = invitation;
