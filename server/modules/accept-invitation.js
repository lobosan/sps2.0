let handleInvitation;

let acceptInvitation = (user, token, promise) => {
  handleInvitation = promise;

  let invitation = _getInvitation(token);
  let userId = _createAccount(user);

  _assignToRole(userId, invitation.role);
  _addUserToContactsList(userId, invitation.authorId);
  _deleteInvite(invitation._id);

  handleInvitation.response(`Hey ${user.profile.name}, welcome!`);
};

let _getInvitation = (token) => {
  try {
    return Invitations.findOne({ "token": token });
  } catch (exception) {
    handleInvitation.error(`[Invitations] ${exception}`);
  }
};

let _createAccount = (user) => {
  try {
    return Accounts.createUser(user);
  } catch (exception) {
    handleInvitation.error(`[Accounts] ${exception}`);
  }
};

let _deleteInvite = (invitation) => {
  try {
    Invitations.remove({ "_id": invitation });
  } catch (exception) {
    handleInvitation.error(`[Invitations] ${exception}`);
  }
};

let _assignToRole = (userId, role) => {
  try {
    Roles.addUsersToRoles(userId, role);
  } catch (exception) {
    handleInvitation.error(`[Roles] ${exception}`);
  }
};

let _addUserToContactsList = (userId, authorId) => {
  try {
    let contactsList = Contacts.find({ authorId: authorId }).count();
    if (contactsList === 0) {
      let directory = Contacts.insert({ authorId: authorId });
      Contacts.update({ _id: directory }, {
        $addToSet: {
          'guests': {
            'userId': userId
          }
        }
      });
    } else {
      Contacts.update({ _id: Contacts.findOne({ authorId: authorId })._id }, {
        $addToSet: {
          'guests': {
            'userId': userId
          }
        }
      });
    }
  } catch (exception) {
    handleInvitation.error(`[Contacts] ${exception}`);
  }
};

Modules.server.acceptInvitation = (user, token) => {
  return new Promise((resolve, reject) => {
    acceptInvitation(user, token, { response: resolve, error: reject });
  });
};
