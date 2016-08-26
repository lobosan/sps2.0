Meteor.publish('contacts', function (authorId) {
  check(authorId, String);
  return Contacts.find({"authorId": authorId});
});
