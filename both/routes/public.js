const publicRedirect = (context, redirect) => {
  if (Meteor.userId()) {
    Modules.both.redirectUser({redirect: redirect});
  }
};

const publicRoutes = FlowRouter.group({
  name: 'public',
  triggersEnter: [publicRedirect]
});

publicRoutes.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('default', {yield: 'home'});
  }
});

publicRoutes.route('/invite/:authorId/:token', {
  name: 'invite',
  action() {
    BlazeLayout.render('default', {yield: 'invite'});
  }
});

publicRoutes.route('/signup', {
  name: 'signup',
  action() {
    BlazeLayout.render('default', {yield: 'signup'});
  }
});

publicRoutes.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('default', {yield: 'login'});
  }
});

publicRoutes.route('/recover-password', {
  name: 'recover-password',
  action() {
    BlazeLayout.render('default', {yield: 'recoverPassword'});
  }
});

publicRoutes.route('/reset-password/:token', {
  name: 'reset-password',
  action() {
    BlazeLayout.render('default', {yield: 'resetPassword'});
  }
});
