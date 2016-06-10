let route = (options) => {
  return options && options.redirect ? _sendUserToDefault(options.redirect) : _sendUserToDefault();
};

let _sendUserToDefault = (redirect) => {
  let roles = _getCurrentUserRoles();

  if (roles[0] === 'admin') {
    _redirectUser('scenarios', redirect);
  }

  if (roles[0] === 'public') {
    _redirectUser('scenarios', redirect);
  }

  if (roles[0] === 'private') {
    _redirectUser('scenarios', redirect);
  }
};

let _getCurrentUserRoles = () => {
  return Roles.getRolesForUser(Meteor.userId());
};

let _redirectUser = (path, redirect) => {
  if (redirect) {
    redirect(path);
  } else {
    FlowRouter.go(FlowRouter.path(path));
  }
};

Modules.both.redirectUser = route;
