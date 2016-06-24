Template.connectivity.onCreated(function () {
  let self = this;
  self.isActiveScenarioReady = new ReactiveVar(false);
  self.isObjectiveListReady = new ReactiveVar(false);
  self.isConnectivityMatrixUserReady = new ReactiveVar(false);

  self.gridSettings = function (numObj) {
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

    return {
      data: Handsontable.helper.createSpreadsheetData(numObj, numObj),
      colHeaders: arrayRowsCols,
      rowHeaders: arrayRowsCols,
      height: '450',
      startRows: numObj,
      startColumns: numObj,
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
    };
  };

  self.autorun(function () {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleObjectiveList = SubsManagerObjectives.subscribe('objectiveList', activeScenario);
    let handleConnectivityMatrixUser = SubsManagerConnectivity.subscribe('connectivityMatrixUser', activeScenario);
    self.isActiveScenarioReady.set(handleActiveScenario.ready());
    self.isObjectiveListReady.set(handleObjectiveList.ready());
    self.isConnectivityMatrixUserReady.set(handleConnectivityMatrixUser.ready());

    if (handleActiveScenario.ready() && handleObjectiveList.ready() && handleConnectivityMatrixUser.ready()) {
      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const currentTurn = currentScenario.turn;
      if (activeScenario && currentTurn) {
        Session.set('scenarioTurn', currentTurn);
        Session.set('numObj', ConnectivityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count());
        Session.set('data', ConnectivityMatrix.find({scenario_id: activeScenario, turn: currentTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch());
        Session.set('settings', self.gridSettings(Session.get('numObj')));
      }
    }
  });
});

Template.connectivity.onRendered(function () {
  var elem = this.find('.js-switch-obj');
  var init = new Switchery(elem);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var container = document.getElementById('connectivity-matrix');
      var hot = new Handsontable(container, Session.get('settings'));
      hot.destroy();
      hot = new Handsontable(container, Session.get('settings'));
      myData = Session.get('data');
      hot.loadData(myData);
    }
  });
});

Template.connectivity.events({
  'click #remove-cm': function () {
    Meteor.call('removeAllConMat');
    Meteor.call('removeAllProbMat');
    Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Open', turn: 0}});
    FlowRouter.go('adminScenario');
  },
  'change .js-switch-obj': function (evt) {
    var checked = $(evt.target)[0].checked;
    if (checked) {
      $('#collapseObjectives').collapse('show');
    } else {
      $('#collapseObjectives').collapse('hide');
    }
  }
});

Template.connectivity.helpers({
  data: function () {
    let activeScenario = Session.get('active_scenario');
    let scenarioTurn = Session.get('scenarioTurn');
    let numObj = Session.get('numObj');
    let data = Session.get('data');
    if (activeScenario && scenarioTurn && numObj && data) {
      return {
        activeScenario: activeScenario,
        scenarioTurn: scenarioTurn,
        numObj: numObj,
        data: data
      };
    }
  }
});
