Template.contacts.onCreated(function () {
  this.userId = () => Meteor.userId();

  this.autorun(() => {
    this.subscribe('participants');
    this.subscribe('openInvitations');
    this.subscribe('contacts', this.userId());
  });
});

Template.contacts.helpers({
  actorList: function () {
    var activeScenario = Session.get('active_scenario');
    var scenarioRow = Scenarios.findOne({_id: activeScenario});
    if (!scenarioRow) return;
    var guests_ids = [scenarioRow.author];
    _.each(scenarioRow.guests, function (guest) {
      guests_ids.push(guest.userid);
    });

    var contactsList = Contacts.findOne({authorId: Meteor.userId()});
    if (!contactsList) return;
    var guestsList = contactsList.guests;

    var contactsGuestsIds = [];
    _.each(guestsList, function (guest) {
      contactsGuestsIds.push(guest.userId);
    });

    var invite_actors = Meteor.users.find({$and: [{_id: {$nin: guests_ids}}, {_id: {$in: contactsGuestsIds}}]});
    if (invite_actors.fetch().length > 0)
      return invite_actors;
    else
      return false;
  },
  hasInvitations: function () {
    var invitations = Invitations.find({authorId: Meteor.userId()}).count();
    return invitations < 1 ? false : true;
  },
  invitations: function () {
    var invitations = Invitations.find({authorId: Meteor.userId()});

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
    var participants = scenario.guests.length;

    if (emails.length >= 1) {
      var allowedParticipants = emails.length + participants;
      if (Roles.userIsInRole(scenario.author, 'public') && allowedParticipants > 3) {
        toastr.options = {"timeOut": "6000", "progressBar": true};
        toastr.warning('Scenarios created by public users can only have up to 3 participants', 'WARNING');
      } else {
        Meteor.call("sendEmail",
          emails,
          "Invitation to participate",
          scenario,
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
