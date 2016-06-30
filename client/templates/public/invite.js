Template.invite.onCreated(function () {
  this.isInviteReady = new ReactiveVar(false);

  this.autorun(() => {
    let handleInvite = SubsManagerInvitations.subscribe('invite', FlowRouter.current().params.token);
    this.isInviteReady.set(handleInvite.ready());
  });
});

Template.invite.helpers({
  invitation: function () {
    var invite = Invitations.findOne();

    if (invite) {
      return invite;
    }
  }
});

Template.invite.events({
  'submit form': function (event, template) {
    event.preventDefault();

    let password = template.find('[name="password"]').value;

    let user = {
      userName: template.find('[name="userName"]').value,
      email: template.find('[name="emailAddress"]').value,
      password: Accounts._hashPassword(password),
      token: FlowRouter.current().params.token
    };

    Meteor.call('acceptInvitation', user, function (error, response) {
      if (error) {
        Bert.alert(error.reason, 'warning');
      } else {
        Meteor.loginWithPassword(user.email, password);
      }
    });
  }
});
