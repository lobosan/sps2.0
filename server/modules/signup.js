let handleSignup;

let signup = (options, promise) => {
  handleSignup = promise;

  let userId = _createAccount(options);
  let userName = options.profile.name;

  _assignToRole(userId, 'public');
  _sendWelcomeEmail(options.email, userName);

  handleSignup.response(`Hey ${ userName }, welcome!`);
};

let _createAccount = (user) => {
  try {
    return Accounts.createUser(user);
  } catch (exception) {
    handleSignup.error(`[Accounts] ${ exception }`);
  }
};

let _assignToRole = (userId, role) => {
  try {
    Roles.addUsersToRoles(userId, role);
  } catch (exception) {
    handleSignup.error(`[Roles] ${ exception }`);
  }
};

let _sendWelcomeEmail = (email, userName) => {
  SSR.compileTemplate('welcome', Assets.getText('email/templates/welcome.html'));
  let html = SSR.render('welcome', {username: userName});

  try {
    Email.send({
      to: email,
      from: `${Meteor.settings.public.appName} <${Meteor.settings.private.spsEmailSender}>`,
      subject: 'Welcome to SPS!',
      html: html
    });
  } catch (exception) {
    handleSignup.error(`[Email] ${ exception }`);
  }
};

Modules.server.signup = (options) => {
  return new Promise((resolve, reject) => {
    signup(options, {response: resolve, error: reject});
  });
};