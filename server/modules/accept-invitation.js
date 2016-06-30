let accept = (options) => {
  var invite = _getInvitation(options.token);
  var user = _createUser(options);

  _addUserToRole(user, invite.role);
  _addUserToContactsList(user, invite.authorId);
  _deleteInvite(invite._id);

  return user;
};

let _createUser = (options) => {
  var userId = Accounts.createUser({'profile': {name: options.userName}, email: options.email, password: options.password});

  if (userId) {
    return userId;
  }
};

let _getInvitation = (token) => {
  var invitation = Invitations.findOne({"token": token});

  if (invitation) {
    return invitation;
  }
};

let _deleteInvite = (invite) => {
  Invitations.remove({"_id": invite});
};

let _addUserToRole = (user, role) => {
  Roles.setUserRoles(user, role);
};

let _addUserToContactsList = (user, authorId) => {
  let contactsList = Contacts.find({authorId: authorId}).count();
  if (contactsList === 0) {
    let directory = Contacts.insert({authorId: authorId});
    Contacts.update({_id: directory}, {
      $addToSet: {
        'guests': {
          'userId': user
        }
      }
    });
  } else {
    Contacts.update({_id: Contacts.findOne({authorId: authorId})._id}, {
      $addToSet: {
        'guests': {
          'userId': user
        }
      }
    });
  }
};

Modules.server.acceptInvitation = accept;
Modules.server.addUserToContactsList = _addUserToContactsList;
