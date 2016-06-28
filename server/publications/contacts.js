Meteor.publish('contacts', function (authorId) {
  check(authorId, String);
  const contacts = Contacts.find({"authorId": authorId});
  if (contacts) return contacts;
  else return this.ready();
});
