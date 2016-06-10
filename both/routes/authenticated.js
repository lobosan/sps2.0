const authenticatedRedirect = () => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    FlowRouter.go('login');
  }
};

const blockUnauthorizedAdmin = (context, redirect) => {
  if (Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Modules.both.redirectUser({redirect: redirect});
  }
};

const blockUnauthorizedRole = (context, redirect) => {
  if (Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'private', 'public']) || !Session.get('active_scenario')) {
    Modules.both.redirectUser({redirect: redirect});
  }
};

const blockUnauthorizedRoleScenarios = (context, redirect) => {
  if (Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'private', 'public'])) {
    Modules.both.redirectUser({redirect: redirect});
  }
};

const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [authenticatedRedirect]
});

authenticatedRoutes.route('/scenarios', {
  name: 'scenarios',
  triggersEnter: [blockUnauthorizedRoleScenarios],
  action() {
    BlazeLayout.render('default', {yield: 'scenarios'});
  }
});

authenticatedRoutes.route('/objectives', {
  name: 'objectives',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'objectives'});
  }
});

authenticatedRoutes.route('/alternatives', {
  name: 'alternatives',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'alternatives'});
  }
});

authenticatedRoutes.route('/contacts', {
  name: 'contacts',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'contacts'});
  }
});

authenticatedRoutes.route('/adminScenario', {
  name: 'adminScenario',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'adminScenario'});
  }
});

authenticatedRoutes.route('/connectivity', {
  name: 'connectivity',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'connectivity'});
  }
});

authenticatedRoutes.route('/probability', {
  name: 'probability',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'probability'});
  }
});

authenticatedRoutes.route('/results', {
  name: 'results',
  triggersEnter: [blockUnauthorizedRole],
  action() {
    BlazeLayout.render('default', {yield: 'results'});
  }
});

authenticatedRoutes.route('/users', {
  name: 'users',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'users'});
  }
});
