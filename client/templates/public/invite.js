Template.invite.onCreated(function () {
  this.token = new ReactiveVar(FlowRouter.current().params.token);
  this.autorun(() => {
    this.subscribe('invite', this.token.get());
  });
});

Template.invite.onRendered(function () {
  let template = Template.instance();
  let token = template.token.get();
  template.subscribe('invite', token, () => {
    // Wait for the data to load using the callback
    Tracker.afterFlush(() => {
      // Use Tracker.afterFlush to wait for the UI to re-render
      // then bind validation to form
      Modules.client.validateInvitation({
        form: "#accept-invitation",
        template: template
      });
    });
  });
});

  Template.invite.events({
    'submit form': (event) => {
      event.preventDefault();
    }
  });

  Template.invite.helpers({
    invitation: function () {
      return Invitations.findOne(
        { token: Template.instance().token.get() }
      );
    }
  });
