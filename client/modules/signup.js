let form,
  template;

let signup = (options) => {
  form = options.form;
  template = options.template;

  _validate(form, template);
};

let _validate = () => {
  $(form).validate(validation());
};

let validation = () => {
  return {
    rules: {
      userName: {
        required: true,
        minlength: 6
      },
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      userName: {
        required: 'Need an user name here.',
        minlength: 'Use at least six characters, please.'
      },
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?'
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.'
      }
    },
    submitHandler() {
      _handleSignup();
    }
  };
};

let _handleSignup = () => {
  let password = template.find('[name="password"]').value,
    user = {
      profile: {
        name: template.find('[name="userName"]').value
      },
      email: template.find('[name="emailAddress"]').value,
      password: Accounts._hashPassword(password)
    };

  Meteor.call('createAccount', user, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
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

Modules.client.signup = signup;