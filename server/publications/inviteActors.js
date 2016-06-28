Meteor.publish("actorList", function () {
  const actorList = Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1}});
  if (actorList) return actorList;
  else return this.ready();
});