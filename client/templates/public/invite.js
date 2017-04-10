Template.invite.onRendered(function () {
  Modules.client.validateInvitation({form: "#accept-invitation", template: Template.instance()});
});

Template.invite.onCreated(function () {
  this.isInviteReady = new ReactiveVar(false);

  this.autorun(() => {
    let handleInvite = Meteor.subscribe('invite', FlowRouter.current().params.token);
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
  'submit form': (event) => event.preventDefault()
});
