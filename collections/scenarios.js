Scenarios = new Mongo.Collection("scenarios");

Scenarios.attachSchema(new SimpleSchema({
  author: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      } else {
        this.unset();
      }
    },
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
  },
  state: {
    type: String,
    allowedValues: [
      "Open",
      "Started",
      "Finished"
    ],
    defaultValue: "Open",
    autoform: {
      type: "hidden",
      label: false
    }
  },
  scope: {
    type: String,
    autoform: {
      type: "select-radio-inline",
      options: function() {
        return [{
          label: "Public",
          value: "Public"
        }, {
          label: "Private",
          value: "Private"
        }];
      }
    },
    defaultValue: "Public",
    label: "Scope"
  },
  creation_date: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    },
    autoform: {
      type: "hidden",
      label: false
    }
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
  'guests.$.userid': {
    type: String
  },
  'guests.$.complete_values': {
    type: String
  },
  turn: {
    type: Number,
    defaultValue: 0,
    autoform: {
      type: "hidden",
      label: false
    },
    optional: true
  }
}));

TabularTables.CurrentScenarios = new Tabular.Table({
  name: "CurrentScenarios",
  collection: Scenarios,
  selector: function(userId) {
    return {
      $and: [{
        state: {
          $ne: 'Finished'
        }
      }, {
        $or: [{
          author: userId
        }, {
          'guests.userid': userId
        }]
      }]
    };
  },
  order: [
    [4, "desc"]
  ],
  responsive: true,
  autoWidth: false,
  columnDefs: [{
    targets: 0,
    createdCell: function(td, cellData, rowData, row, col) {
      if (isUserJoined(rowData._id)) $(td).addClass('scenario-name');
      else $(td).addClass('scenario-disabled');
    }
  }],
  columns: [{
    data: "name",
    title: "Name",
    render: function(val, type, doc) {
      return Session.get('active_scenario') === doc._id ? '<i class="active-scenario fa fa-toggle-on"></i> ' + val : val;
    }
  }, {
    data: "description",
    title: "Description"
  }, {
    data: "state",
    title: "State"
  }, {
    data: "turn",
    title: "Turn"
  }, {
    data: "creation_date",
    title: "Created At",
    render: function(val, type, doc) {
      if (val instanceof Date) {
        return moment(val).format('DD/MM/YYYY');
      } else {
        return "Never";
      }
    }
  }, {
    title: "Participation",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.joinScenario
  }, {
    title: "Evaluate",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.evaluateScenario
  }, {
    title: "Results",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.resultsScenario
  }]
});

TabularTables.PublicScenarios = new Tabular.Table({
  name: "PublicScenarios",
  collection: Scenarios,
  selector: function() {
    return {
      scope: 'Public'
    };
  },
  order: [
    [4, "desc"]
  ],
  responsive: true,
  autoWidth: false,
  columnDefs: [{
    targets: 0,
    createdCell: function(td, cellData, rowData, row, col) {
      if (isUserJoined(rowData._id)) $(td).addClass('scenario-name');
      else $(td).addClass('scenario-disabled');
    }
  }],
  columns: [{
    data: "name",
    title: "Name",
    render: function(val, type, doc) {
      return Session.get('active_scenario') === doc._id ? '<i class="active-scenario fa fa-toggle-on"></i> ' + val : val;
    }
  }, {
    data: "description",
    title: "Description"
  }, {
    data: "state",
    title: "State"
  }, {
    data: "turn",
    title: "Turn"
  }, {
    data: "creation_date",
    title: "Created At",
    render: function(val, type, doc) {
      if (val instanceof Date) {
        return moment(val).format('DD/MM/YYYY');
      } else {
        return "Never";
      }
    }
  }, {
    title: "Participation",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.joinScenario
  }, {
    title: "Evaluate",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.evaluateScenario
  }, {
    title: "Results",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.resultsScenario
  }]
});

TabularTables.PrivateScenarios = new Tabular.Table({
  name: "PrivateScenarios",
  collection: Scenarios,
  selector: function(userId) {
    return {
      $and: [{
        scope: 'Private'
      }, {
        $or: [{
          author: userId
        }, {
          'guests.userid': userId
        }]
      }]
    };
  },
  order: [
    [4, "desc"]
  ],
  responsive: true,
  autoWidth: false,
  columnDefs: [{
    targets: 0,
    createdCell: function(td, cellData, rowData, row, col) {
      if (isUserJoined(rowData._id)) $(td).addClass('scenario-name');
      else $(td).addClass('scenario-disabled');
    }
  }],
  columns: [{
    data: "name",
    title: "Name",
    render: function(val, type, doc) {
      return Session.get('active_scenario') === doc._id ? '<i class="active-scenario fa fa-toggle-on"></i> ' + val : val;
    }
  }, {
    data: "description",
    title: "Description"
  }, {
    data: "state",
    title: "State"
  }, {
    data: "turn",
    title: "Turn"
  }, {
    data: "creation_date",
    title: "Created At",
    render: function(val, type, doc) {
      if (val instanceof Date) {
        return moment(val).format('DD/MM/YYYY');
      } else {
        return "Never";
      }
    }
  }, {
    title: "Participation",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.joinScenario
  }, {
    title: "Evaluate",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.evaluateScenario
  }, {
    title: "Results",
    className: "text-center",
    orderable: false,
    tmpl: Meteor.isClient && Template.resultsScenario
  }]
});