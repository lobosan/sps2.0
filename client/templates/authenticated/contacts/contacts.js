Template.contacts.onCreated(() => {
  Template.instance().subscribe('actorList');
  Template.instance().subscribe('openInvitations');
  Template.instance().subscribe('contacts', Meteor.userId());
});

Template.contacts.helpers({
  actorList: function () {
    var scenarioRow = Scenarios.findOne({_id: Session.get('active_scenario')});
    var guests_ids = [scenarioRow.author];
    _.each(scenarioRow.guests, function (guest) {
      guests_ids.push(guest.userid);
    });

    var contactsList = Contacts.findOne({authorId: Meteor.userId()}).guests;
    var contactsGuestsIds = [];
    _.each(contactsList, function (guest) {
      contactsGuestsIds.push(guest.userId);
    });

    var invite_actors = Meteor.users.find({$and: [{_id: {$nin: guests_ids}}, {_id: {$in: contactsGuestsIds}}]});
    if (invite_actors.fetch().length > 0)
      return invite_actors;
    else
      return false;
  },
  hasInvitations: function () {
    var invitations = Invitations.find().count();
    return invitations < 1 ? false : true;
  },
  invitations: function () {
    var invitations = Invitations.find();

    if (invitations) {
      return invitations;
    }
  }
});

Template.contacts.events({
  'click #inviteActorsBtn': function (evt, tmpl) {
    var userids = $('.actorId:checkbox:checked').map(function () {
      return this.value;
    }).get();

    var users = Meteor.users.find({'_id': {$in: userids}}).fetch();

    var emails = [];
    for (var i = 0; i < users.length; i++) {
      emails.push(users[i].emails[0].address);
    }

    var scenario = Scenarios.findOne({_id: Session.get('active_scenario')});

    let domain = Meteor.settings.public.domain;

    var html = "<h1>Scenario Planning System</h1>"
      + "You've been invited to participate in the scenario: " + scenario.name + "<br><br>"
      + "Description: " + scenario.description + "<br><br>"
      + "Go to the platform to <a href='http://"+domain+"'>participate</a>";

    if (emails.length >= 1) {
      Meteor.call("sendEmail",
        emails,
        "SPS invitation",
        html,
        function (err) {
          if (err) {
            toastr.options = {"timeOut": "6000", "progressBar": true};
            toastr.error('Uh oh, something went wrong', 'ERROR');
          } else {
            Meteor.call('scenarioHasActors', Session.get('active_scenario'), userids);
            toastr.options = {"timeOut": "6000", "progressBar": true};
            toastr.success('The invitations to participate in the scenario have been sent to the guests', 'Invitations sent');
          }
        }
      );
    }
  },
  'click .revoke-invite': function (event, template) {
    if (confirm("Are you sure? This is permanent.")) {
      Meteor.call("revokeInvitation", this._id, function (error, response) {
        if (error) {
          Bert.alert(error.reason, "warning");
        } else {
          Bert.alert("Invitation revoked!", "success");
        }
      });
    }
  }
});
