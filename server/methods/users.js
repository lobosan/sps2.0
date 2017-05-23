Meteor.methods({
  createAccount(user) {
    check(user, {
      profile: {
        name: String
      },
      email: String,
      password: Object
    });

    return Modules.server.signup(user).then((response) => {
      return response;
    }).catch((error) => {
      throw new Meteor.Error('500', `${ error }`);
    });
  },
  acceptInvitation(user, token) {
    check(user, {
      profile: {
        name: String
      },
      email: String,
      password: Object
    });
    check(token, String);

    return Modules.server.acceptInvitation(user, token).then((response) => {
      return response;
    }).catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
  setRoleOnUser(options) {
    check(options, {
      user: String,
      role: String
    });

    try {
      Roles.setUserRoles(options.user, [options.role]);
    } catch (exception) {
      return exception;
    }
  }
});
