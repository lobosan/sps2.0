Template.reports.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('connectivityMatrix', this.activeScenario());
    this.subscribe('probabilityMatrix', this.activeScenario());
  });
});

Template.reports.onRendered(function () {
  const elemObj = document.getElementsByClassName('js-switch-obj');
  const elemAlt = document.getElementsByClassName('js-switch-alt');
  new Switchery(elemObj[0]);
  new Switchery(elemAlt[0]);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      const activeScenario = Session.get('active_scenario');
      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const currentTurn = currentScenario.turn;
      const selectTurn = document.getElementById('turn');
      const strSelectTurn = selectTurn.options[selectTurn.selectedIndex].text;
      if (strSelectTurn == 'Select one') Session.set('turn', currentTurn);

      const connectivityMatrixScenarioTurn = ConnectivityMatrix.find({scenario_id: activeScenario, turn: Session.get('turn')}, {sort: {created_at: 1}}).fetch();
      const probabilityMatrixScenarioTurn = ProbabilityMatrix.find({scenario_id: activeScenario, turn: Session.get('turn')}, {sort: {created_at: 1}}).fetch();

      let results = calculations(currentScenario, connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn);
      buildInfluenceDependenceUser(results.infDepCurrentUser);
      buildProbabilityUser(results.probabilityCurrentUser);
      buildInfluenceDependenceGlobal(results.infDepGlobal);
      buildProbabilityGlobal(results.probabilityGlobal);
    }
  });
});

Template.results.events({
  'click #complete_values': function (event, template) {
    Meteor.call('updateCompletedValues', Session.get('active_scenario'), Meteor.userId(), 'Yes');
    toastr.options = {"timeOut": "8000", "progressBar": true};
    toastr.success('You can still update the values until the owner of the scenario changes the turn or finishes the evaluation', 'Evaluation confirmed');
  },
  'change #turn': function (event, template) {
    var turn = template.$(event.target).val();
    Session.set('turn', parseInt(turn));
  },
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

Template.results.helpers({
  turns: function () {
    var activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;
    var currentScenario = Scenarios.findOne({_id: activeScenario});
    if (!currentScenario) return;
    var turn = currentScenario.turn;
    var turns = [];
    for (var i = 1; i <= turn; i++) {
      turns.push({turn: i});
    }
    return turns;
  },
  objCoord: function () {
    var infDepGlobal = Session.get('infDepGlobal');
    var objNamesGlobal = Session.get('objNamesGlobal');
    if (infDepGlobal && objNamesGlobal) {
      if (infDepGlobal.length === 0 || objNamesGlobal.length === 0) return;
      var objCoord = [];
      _.each(infDepGlobal, function (coordinates, key) {
        objCoord.push({'objName': objNamesGlobal[key].objName, 'coordinates': coordinates.toString().replace(',', ', ')});
      });
      return objCoord;
    }
  },
  probCoord: function () {
    var probGlobal = Session.get('probGlobal');
    var altNamesGlobal = Session.get('altNamesGlobal');
    if (probGlobal && altNamesGlobal) {
      if (probGlobal.length === 0 || altNamesGlobal.length === 0) return;
      var probCoord = [];
      _.each(probGlobal, function (coordinates, key) {
        probCoord.push({'altName': altNamesGlobal[key].altName, 'probability': coordinates.toString().replace(',', ', ')});
      });
      return probCoord;
    }
  }
});