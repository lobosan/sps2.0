Template.connectivityMatrix.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('connectivityMatrixUser', this.activeScenario());
  });
});

Template.connectivityMatrix.onRendered(function () {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      const activeScenario = Session.get('active_scenario');
      if (!activeScenario) return;

      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const currentTurn = currentScenario.turn;
      //Session.set('scenarioTurn', currentTurn);
      var numObj = ConnectivityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count();

      var columns = [];
      var arrayRowsCols = [];

      for (var i = 1; i <= numObj; i++) {
        columns.push({
          'data': 'o' + i,
          'type': 'dropdown',
          'source': ['0', '1'],
          'strict': true,
          'allowInvalid': false
        });
        arrayRowsCols.push('Obj' + i);
      }

      var myData = [];  // Need this to create instance
      var container = document.getElementById('connectivity-matrix');

      var hot = new Handsontable(container, { // Create Handsontable instance
        data: myData,
        colHeaders: arrayRowsCols,
        rowHeaders: arrayRowsCols,
        height: '450',
        //width: this.$('.container').width(),
        maxRows: numObj,
        maxCols: numObj,
        columns: columns,
        cells: function (r, c, prop) {
          var cellProperties = {};
          for (var i = 0; i < numObj; i++) {
            if (r === i && c === i) {
              cellProperties.readOnly = true;
              cellProperties.type = 'text';
            }
          }
          return cellProperties;
        },
        afterChange: function (change, source) {  // 'change' is an array of arrays.
          if (source !== 'loadData') {  // Don't need to run this when data is loaded
            for (i = 0; i < change.length; i++) {   // For each change, get the change info and update the record
              var rowNum = change[i][0]; // Which row it appears on Handsontable
              var row = myData[rowNum];  // Now we have the whole row of data, including _id
              var key = change[i][1];  // Handsontable docs calls this 'prop'
              var oldVal = change[i][2];
              var newVal = change[i][3];
              var setModifier = {$set: {}};   // Need to build $set object
              setModifier.$set[key] = newVal; // So that we can assign 'key' dynamically using bracket notation of JavaScript object
              ConnectivityMatrix.update(row._id, setModifier);
            }
          }
        }
      });

      myData = ConnectivityMatrix.find({scenario_id: activeScenario, turn: currentTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch();  // Tie in our data
      hot.loadData(myData);
    }
  });
});

Template.connectivity.onRendered(function () {
  var elem = this.find('.js-switch-obj');
  new Switchery(elem);
});

Template.connectivity.events({
  'change .js-switch-obj': function (event, template) {
    var checked = template.$(event.target)[0].checked;
    if (checked) {
      template.$('#collapseObjectives').collapse('show');
    } else {
      template.$('#collapseObjectives').collapse('hide');
    }
  }/*,
  'click #remove-cm': function () {
   Meteor.call('removeAllConMat');
   Meteor.call('removeAllProbMat');
   Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Open', turn: 0}});
   FlowRouter.go('adminScenario');
   }*/
});
