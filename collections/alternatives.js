Alternatives = new Mongo.Collection("alternatives");

Alternatives.attachSchema(new SimpleSchema({
    scenario_id: {
        type: String,
        autoform: {
            type: "hidden",
            label: false
        }
    },
    turn: {
        type: Number,
        autoform: {
            type: "hidden",
            label: false
        }
    },
    name: {
        type: String,
        label: "Name",
        max: 300
    },
    description: {
        type: String,
        label: "Description",
        max: 1000,
        autoform: {
            type: "textarea"
        }
    }
}));