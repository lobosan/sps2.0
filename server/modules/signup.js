let handleSignup;

let signup = (options, promise) => {
  handleSignup = promise;

  let userId = _createAccount(options),
    userName = options.profile.name;

  _assignToRole(userId, 'admin');
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

let _assignToRole = (userId, roles) => {
  try {
    Roles.addUsersToRoles(userId, roles);
  } catch (exception) {
    handleSignup.error(`[Roles] ${ exception }`);
  }
};

let _sendWelcomeEmail = (email, userName) => {
  try {
    Email.send({
      to: email,
      from: 'SPS <sp.galindoh@gmail.com>',
      subject: 'Welcome to the app!',
      text: `Hey ${ userName }!\n\n
      Welcome to the Scenario Planning System. Thanks for signing up :)\n\n
      - Santiago`
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