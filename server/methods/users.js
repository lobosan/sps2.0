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
  acceptInvitation(user) {
    check(user, {
      email: String,
      password: Object,
      token: String
    });

    try {
      var userId = Modules.server.acceptInvitation(user);
      return userId;
    } catch (exception) {
      return exception;
    }
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
