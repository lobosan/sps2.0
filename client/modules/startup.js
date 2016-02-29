let startup = () => {
  SimpleSchema.debug = true;
  AutoForm.debug();
  Bert.defaults.style = 'growl-top-right';
};

Modules.client.startup = startup;
