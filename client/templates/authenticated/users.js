Template.users.onCreated(function () {
  this.isUsersReady = new ReactiveVar(false);

  this.autorun(() => {
    let handleUsers = Meteor.subscribe('users');
    this.isUsersReady.set(handleUsers.ready());
  });
});

Template.users.helpers({
  users: function () {
    var users = Meteor.users.find();

    if (users) {
      return users;
    }
  }
});

Template.users.events({
  'change [name="userRole"]': function (event, template) {
    let role = $(event.target).find('option:selected').val();

    Meteor.call("setRoleOnUser", {
      user: this._id,
      role: role
    }, (error, response) => {
      if (error) {
        Bert.alert(error.reason, "warning");
      }
    });
  }
});
