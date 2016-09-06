Meteor.methods({
  objectiveActiveInactive: function (objId, active) {
    check(objId, String);
    check(active, String);
    return Objectives.update({_id: objId}, {$set: {active: active}});
  }
});