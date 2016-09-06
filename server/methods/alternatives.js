Meteor.methods({
  alternativeActiveInactive: function (altId, active) {
    check(altId, String);
    check(active, String);
    return Alternatives.update({_id: altId}, {$set: {active: active}});
  }
});