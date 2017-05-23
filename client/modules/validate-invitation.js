let form;
let template;

let validateInvitation = (options) => {
  form = options.form;
  template = options.template;

  _validate();
};

let _validate = () => {
  $(form).validate(validation());
};

let validation = () => {
  return {
    rules: {
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.'
      }
    },
    submitHandler() {
      _handleInvitation();
    }
  };
};

let _handleInvitation = () => {
  let password = template.find('[name="password"]').value;

  let user = {
    profile: {
      name: template.find('[name="userName"]').value
    },
    email: template.find('[name="emailAddress"]').value,
    password: Accounts._hashPassword(password)
  };

  let token = FlowRouter.current().params.token;

  Meteor.call('acceptInvitation', user, token, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
      console.log(error.reason);
    } else {
      _loginUser(user.email, password, response);
    }
  });
};

let _loginUser = (email, password, welcomeMessage) => {
  Meteor.loginWithPassword(email, password, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(welcomeMessage, 'success');
    }
  });
};

Modules.client.validateInvitation = validateInvitation;
