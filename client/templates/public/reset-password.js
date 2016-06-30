Template.resetPassword.onRendered(function () {
  Modules.client.resetPassword({
    form: "#reset-password",
    template: Template.instance()
  });
});

Template.resetPassword.events({
  'submit form': (event) => event.preventDefault()
});
