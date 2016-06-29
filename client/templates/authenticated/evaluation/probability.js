Template.probability.onCreated(function () {
  this.isActiveScenarioReady = new ReactiveVar(false);
  this.isObjectiveListReady = new ReactiveVar(false);
  this.isAlternativeListReady = new ReactiveVar(false);
  this.isConnectivityMatrixUserReady = new ReactiveVar(false);
  this.isProbabilityMatrixUserReady = new ReactiveVar(false);

  this.gridSettings = function (numObj, numAlt) {
    var columns = [];
    var colHeaders = [];
    var rowHeaders = [];

    var validator = [];
    for (var i = 0; i <= 100; i++) {
      validator.push(i);
    }

    for (var i = 1; i <= numObj; i++) {
      columns.push({
        'data': 'p' + i,
        'type': 'dropdown',
        'source': validator,
        'strict': true,
        'allowInvalid': false
      });
      colHeaders.push('Obj' + i + ' %');
    }

    for (var j = 1; j <= numAlt; j++) {
      rowHeaders.push('Alt' + j);
    }

    return {
      data: Handsontable.helper.createSpreadsheetData(numAlt, numObj),
      colHeaders: colHeaders,
      rowHeaders: rowHeaders,
      height: '450',
      maxRows: numAlt,
      startRows: numAlt,
      maxCols: numObj,
      startCols: numObj,
      columns: columns
    };
  };

  this.autorun(() => {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleObjectiveList = SubsManagerObjectives.subscribe('objectiveList', activeScenario);
    let handleAlternativeList = SubsManagerAlternatives.subscribe('alternativeList', activeScenario);
    let handleConnectivityMatrixUser = SubsManagerConnectivity.subscribe('connectivityMatrixUser', activeScenario);
    let handleProbabilityMatrixUser = SubsManagerProbability.subscribe('probabilityMatrixUser', activeScenario);
    this.isActiveScenarioReady.set(handleActiveScenario.ready());
    this.isObjectiveListReady.set(handleObjectiveList.ready());
    this.isAlternativeListReady.set(handleAlternativeList.ready());
    this.isConnectivityMatrixUserReady.set(handleConnectivityMatrixUser.ready());
    this.isProbabilityMatrixUserReady.set(handleProbabilityMatrixUser.ready());

    if (handleActiveScenario.ready() && handleObjectiveList.ready() && handleAlternativeList.ready() && handleConnectivityMatrixUser.ready() && handleProbabilityMatrixUser.ready()) {
      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const currentTurn = currentScenario.turn;
      if (activeScenario && currentTurn) {
        Session.set('scenarioTurn', currentTurn);
        Session.set('numObj', ConnectivityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count());
        Session.set('numAlt', ProbabilityMatrix.find({scenario_id: activeScenario, user_id: Meteor.userId(), turn: currentTurn}).count());
        Session.set('data', ProbabilityMatrix.find({scenario_id: activeScenario, turn: currentTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch());
        Session.set('settings', this.gridSettings(Session.get('numObj'), Session.get('numAlt')));
      }
    }
  });
});

Template.probability.onRendered(function () {
  var elemObj = this.find('.js-switch-obj');
  var initObj = new Switchery(elemObj);

  var elemAlt = this.find('.js-switch-alt');
  var initAlt = new Switchery(elemAlt);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var container = document.getElementById('probability-matrix');
      var hot = new Handsontable(container, Session.get('settings'));
      hot.destroy();
      hot = new Handsontable(container, Session.get('settings'));
      hot.loadData(Session.get('data'));
      hot.addHook('afterChange', function (change, source) {  // "change" is an array of arrays.
        var myData = Session.get('data');
        if (source !== 'loadData') {  // Don't need to run this when data is loaded
          for (i = 0; i < change.length; i++) {   // For each change, get the change info and update the record
            var rowNum = change[i][0]; // Which row it appears on Handsontable
            var row = myData[rowNum];  // Now we have the whole row of data, including _id
            var key = change[i][1];  // Handsontable docs calls this "prop"
            var oldVal = change[i][2];
            var newVal = change[i][3];
            var setModifier = {$set: {}};   // Need to build $set object
            setModifier.$set[key] = newVal; // So that we can assign 'key' dynamically using bracket notation of JavaScript object
            ProbabilityMatrix.update(row._id, setModifier);
          }
        }
      });
    }
  });
});

Template.probability.events({
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
  },
  'change .js-switch-alt': function (evt) {
    var checked = $(evt.target)[0].checked;
    if (checked) {
      $('#collapseAlternatives').collapse('show');
    } else {
      $('#collapseAlternatives').collapse('hide');
    }
  }
});