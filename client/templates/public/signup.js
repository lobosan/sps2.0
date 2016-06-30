Template.signup.onRendered(function () {
  Modules.client.signup({
    form: "#signup",
    template: Template.instance()
  });
});

Template.signup.events({
  'submit form': (event) => event.preventDefault()
});