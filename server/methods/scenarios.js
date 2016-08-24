Meteor.methods({
  updateCompletedValues: function (active_scenario, guest_id, complete_values) {
    check(active_scenario, String);
    check(guest_id, String);
    check(complete_values, String);

    Scenarios.update(
      {'_id': active_scenario, 'guests.userid': guest_id},
      {$set: {'guests.$.complete_values': complete_values}}
    );
  },
  notifyNextTurn: function (scenario_name, scenario_description, guests_ids) {
    check(scenario_name, String);
    check(scenario_description, String);
    check(guests_ids, [String]);

    var users = Meteor.users.find({'_id': {$in: guests_ids}}).fetch();

    var emails = [];
    for (var i = 0; i < users.length; i++) {
      emails.push(users[i].emails[0].address);
    }

    let domain = Meteor.settings.public.domain;

    var html = "<h1>Scenario Planning System</h1>"
      + "The scenario <b>" + scenario_name + "</b> has started a new turn<br><br>"
      + "Description: " + scenario_description + "<br><br>"
      + "Go to the platform to select the scenario described above and continue your <a href='"+domain+"'>evaluation</a>";

    if (emails.length >= 1) {
      this.unblock();

      if (!Meteor.user()) throw new Meteor.Error(403, "not logged in");

      Email.send({
        to: emails,
        from: Meteor.user().emails[0].address,
        subject: "SPS - Next turn notification",
        html: html
      });
    }
  }
});