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

    SSR.compileTemplate('next-turn', Assets.getText('email/templates/next-turn.html'));
    let html = SSR.render('next-turn', {scenario: scenario_name, description: scenario_description, domain: domain});

    if (emails.length >= 1) {
      this.unblock();

      if (!Meteor.user()) throw new Meteor.Error(403, "not logged in");

      Email.send({
        to: emails,
        from: `${Meteor.settings.public.appName} <${Meteor.user().emails[0].address}>`,
        subject: "Next turn notification",
        html: html
      });
    }
  }
});