Meteor.publish("actorList", function () {
    return Meteor.users.find({}, {fields: {"profile.name": 1, "emails.address": 1}});
});