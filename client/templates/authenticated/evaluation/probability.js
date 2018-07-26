Template.probabilityMatrix.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('connectivityMatrixUser', this.activeScenario());
    this.subscribe('probabilityMatrixUser', this.activeScenario());
  });
});

Template.probabilityMatrix.onRendered(function () {
  const elemObj = document.getElementsByClassName('js-switch-obj');
  const elemAlt = document.getElementsByClassName('js-switch-alt');
  new Switchery(elemObj[0]);
  new Switchery(elemAlt[0]);

  this.autorun((computation) => {
    if (this.subscriptionsReady()) {
      const activeScenario = Session.get('active_scenario');
      if (!activeScenario) return;

      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const currentTurn = currentScenario.turn;
      const numObj = ConnectivityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count();
      const numAlt = ProbabilityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count();
      //Session.set('scenarioTurn', currentTurn);

      var columns = [];
      var colHeaders = [];
      var rowHeaders = [];

      for (var i = 1; i <= numObj; i++) {
        columns.push({
          'data': 'p' + i,
          'validator': /^[0-9][0-9]?$|^100$/,
          'allowInvalid': false
        });
        colHeaders.push('Obj' + i + ' %');
      }

      for (var i = 1; i <= numAlt; i++) {
        rowHeaders.push('Alt' + i);
      }

      var myData = [];  // Need this to create instance
      var container = document.getElementById('probability-matrix');

      var hot = new Handsontable(container, { // Create Handsontable instance
        data: myData,
        colHeaders: colHeaders,
        rowHeaders: rowHeaders,
        height: '450',
        //width: this.$('.container').width(),
        maxRows: numAlt,
        maxCols: numObj,
        columns: columns,
        afterChange: function (change, source) {  // "change" is an array of arrays.
          if (source !== 'loadData') {  // Don't need to run this when data is loaded
            for (i = 0; i < change.length; i++) {   // For each change, get the change info and update the record
              var rowNum = change[i][0]; // Which row it appears on Handsontable
              var row = myData[rowNum];  // Now we have the whole row of data, including _id
              var key = change[i][1];  // Handsontable docs calls this "prop"
              var oldVal = change[i][2];
              var newVal = change[i][3];
              var setModifier = {$set: {}};   // Need to build $set object
              setModifier.$set[key] = parseInt(newVal); // So that we can assign 'key' dynamically using bracket notation of JavaScript object
              ProbabilityMatrix.update(row._id, setModifier);
            }
          }
        }
      });

      myData = ProbabilityMatrix.find({scenario_id: activeScenario, turn: currentTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch(); // Tie in our data
      hot.loadData(myData);
      computation.stop();
    }
  });
});

Template.probability.events({
  'change .js-switch-obj': function (event, template) {
    var checked = template.$(event.target)[0].checked;
    if (checked) {
      template.$('#collapseObjectives').collapse('show');
    } else {
      template.$('#collapseObjectives').collapse('hide');
    }
  },
  'change .js-switch-alt': function (event, template) {
    var checked = template.$(event.target)[0].checked;
    if (checked) {
      template.$('#collapseAlternatives').collapse('show');
    } else {
      template.$('#collapseAlternatives').collapse('hide');
    }
  }
});
