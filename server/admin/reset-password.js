Accounts.emailTemplates.resetPassword.siteName = () => Meteor.settings.public.appName;
Accounts.emailTemplates.resetPassword.from = () => `${Meteor.settings.public.appName} <${Meteor.settings.private.spsEmailSender}>`;
Accounts.emailTemplates.resetPassword.subject = () => 'Reset your password';
Accounts.emailTemplates.resetPassword.html = (user, url) => {
  let email = user.emails[0].address;
  let urlWithoutHash = url.replace('#/', '');

  SSR.compileTemplate('recover-password', Assets.getText('email/templates/recover-password.html'));
  return SSR.render('recover-password', {email: email, url: urlWithoutHash});
};
