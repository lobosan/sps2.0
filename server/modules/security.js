let security = () => {
  Security.defineMethod("ifIsOwner", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
      return userId !== doc._id;
    }
  });

  // Only if an admin user is logged in
  Security.permit(['insert', 'update', 'remove']).collections([
    Scenarios, Objectives, Alternatives, ConnectivityMatrix, ProbabilityMatrix, Invitations, Contacts, Meteor.users
  ]).ifHasRole('admin').allowInClientCode();

  // Only if a user is logged in
  Security.permit(['insert', 'update']).collections([
    Scenarios, Objectives, Alternatives, ConnectivityMatrix, ProbabilityMatrix, Invitations, Contacts
  ]).ifLoggedIn().allowInClientCode();

  // Only if a user is logged in and is the owner of the document
  Security.permit(['update', 'remove']).collections([
    Scenarios, Objectives, Alternatives, ConnectivityMatrix, ProbabilityMatrix, Invitations, Contacts
  ]).ifLoggedIn().ifIsOwner().allowInClientCode();

  // Only if a user doesn't try to change the roles property and is the owner of the document
  Meteor.users.permit('update').ifLoggedIn().ifIsOwner().exceptProps(['roles']).allowInClientCode();
};

Modules.server.security = security;