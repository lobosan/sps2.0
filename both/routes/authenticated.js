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

const blockUnauthorizedManager = (context, redirect) => {
  if (Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'manager'])) {
    Modules.both.redirectUser({redirect: redirect});
  }
};

const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [authenticatedRedirect]
});

authenticatedRoutes.route('/scenarios', {
  name: 'scenarios',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'scenarios'});
  }
});

authenticatedRoutes.route('/objectives', {
  name: 'objectives',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'objectives'});
  }
});

authenticatedRoutes.route('/alternatives', {
  name: 'alternatives',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'alternatives'});
  }
});

authenticatedRoutes.route('/contacts', {
  name: 'contacts',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'contacts'});
  }
});

authenticatedRoutes.route('/adminScenario', {
  name: 'adminScenario',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'adminScenario'});
  }
});

authenticatedRoutes.route('/connectivity', {
  name: 'connectivity',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'connectivity'});
  }
});

authenticatedRoutes.route('/probability', {
  name: 'probability',
  triggersEnter: [blockUnauthorizedAdmin],
  action() {
    BlazeLayout.render('default', {yield: 'probability'});
  }
});

authenticatedRoutes.route('/results', {
  name: 'results',
  triggersEnter: [blockUnauthorizedAdmin],
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

authenticatedRoutes.route('/managers', {
  name: 'managers',
  triggersEnter: [blockUnauthorizedManager],
  action() {
    BlazeLayout.render('default', {yield: 'managers'});
  }
});

authenticatedRoutes.route('/employees', {
  name: 'employees',
  action() {
    BlazeLayout.render('default', {yield: 'employees'});
  }
});
