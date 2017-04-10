let validateInvitation = (options) => {
  _validate(options.form, options.template);
};

let _validate = (form, template) => {
  $(form).validate(validation(template));
};

let validation = (template) => {
  return {
    rules: {
      password: {
        required: true
      }
    },
    messages: {
      password: {
        required: 'Need a password here.'
      }
    },
    submitHandler() {
      _acceptInvitation(template);
    }
  };
};

let _acceptInvitation = (template) => {
  let password = template.find('[name="password"]').value;

  let user = {
    userName: template.find('[name="userName"]').value,
    email: template.find('[name="emailAddress"]').value,
    password: Accounts._hashPassword(password),
    token: FlowRouter.current().params.token
  };

  Meteor.call('acceptInvitation', user, (error) => {
    if (error) {
      Bert.alert(error.reason, 'warning');
    } else {
      Meteor.loginWithPassword(user.email, password);
    }
  });
};

Modules.client.validateInvitation = validateInvitation;
