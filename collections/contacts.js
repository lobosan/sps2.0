Contacts = new Mongo.Collection("contacts");
SubsManagerContacts = new SubsManager();

Contacts.attachSchema(new SimpleSchema({
  authorId: {
    type: String
  },
  guests: {
    type: [Object],
    defaultValue: [],
    autoform: {
      type: "hidden",
      label: false
    },
    optional: true
  },
  'guests.$.userId': {
    type: String
  }
}));