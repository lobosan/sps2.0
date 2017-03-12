Accounts.emailTemplates.resetPassword.from = () => Meteor.settings.private.spsEmailSender;
Accounts.emailTemplates.resetPassword.subject = () => 'SPS - Reset your password';
Accounts.emailTemplates.resetPassword.html = (user, url) => {
  let emailAddress = user.emails[0].address;
  let urlWithoutHash = url.replace('#/', '');
  return "<h1>Scenario Planning System</h1>"
      + "<p>A password reset has been requested for the account related to this address (" + emailAddress + ").</p>"
      + "<p>To reset the password, visit the following link:</p>"
      + "<p><a href='"+ urlWithoutHash +"'>Reset link >></a></p>"
      + "<p>If you did not request this reset, please ignore this email.<br>"
      + "If you feel something is wrong, please contact our support team: sps@kenjygroup.com.</p>";
};
