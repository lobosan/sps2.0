Template.default.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    if (this.activeScenario()) {
      this.subscribe('activeScenario', this.activeScenario());
    }
  });
});

const handleRedirect = (routes, redirect) => {
  let currentRoute = FlowRouter.getRouteName();
  if (routes.indexOf(currentRoute) > -1) {
    FlowRouter.go(redirect);
    return true;
  }
};

Template.default.helpers({
  loggingIn() {
    return Meteor.loggingIn();
  },
  authenticated() {
    return !Meteor.loggingIn() && Meteor.user();
  },
  redirectAuthenticated() {
    return handleRedirect([
      'login',
      'signup',
      'recover-password',
      'reset-password'
    ], '/');
  },
  redirectPublic() {
    return handleRedirect([
      'index',
      'dashboard'
    ], '/login');
  }
});