Template.results.onCreated(function () {
  this.isActiveScenarioReady = new ReactiveVar(false);
  this.isObjectiveListReady = new ReactiveVar(false);
  this.isAlternativeListReady = new ReactiveVar(false);
  this.isConnectivityMatrixReady = new ReactiveVar(false);
  this.isProbabilityMatrixReady = new ReactiveVar(false);

  this.autorun(() => {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    const handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    const handleObjectiveList = SubsManagerObjectives.subscribe('objectiveList', activeScenario);
    const handleAlternativeList = SubsManagerAlternatives.subscribe('alternativeList', activeScenario);
    const handleConnectivityMatrix = SubsManagerConnectivity.subscribe('connectivityMatrix', activeScenario);
    const handleProbabilityMatrix = SubsManagerProbability.subscribe('probabilityMatrix', activeScenario);

    this.isActiveScenarioReady.set(handleActiveScenario.ready());
    this.isObjectiveListReady.set(handleObjectiveList.ready());
    this.isAlternativeListReady.set(handleAlternativeList.ready());
    this.isConnectivityMatrixReady.set(handleConnectivityMatrix.ready());
    this.isProbabilityMatrixReady.set(handleProbabilityMatrix.ready());

    if (handleActiveScenario.ready() && handleObjectiveList.ready() && handleAlternativeList.ready() && handleConnectivityMatrix.ready() && handleProbabilityMatrix.ready()) {
      const currentScenario = Scenarios.findOne({_id: activeScenario});
      const connectivityMatrixScenarioTurn = ConnectivityMatrix.find({scenario_id: activeScenario, turn: Session.get('turn')}, {sort: {created_at: 1}}).fetch();
      const probabilityMatrixScenarioTurn = ProbabilityMatrix.find({scenario_id: activeScenario, turn: Session.get('turn')}, {sort: {created_at: 1}}).fetch();

      if (activeScenario && currentScenario && connectivityMatrixScenarioTurn && probabilityMatrixScenarioTurn) {
        Session.set('currentScenario', currentScenario);
        Session.set('connectivityMatrixScenarioTurn', connectivityMatrixScenarioTurn);
        Session.set('probabilityMatrixScenarioTurn', probabilityMatrixScenarioTurn);
      }
    }
  });
});

Template.results.onRendered(function () {
  var elemObj = this.find('.js-switch-obj');
  var initObj = new Switchery(elemObj);

  var elemAlt = this.find('.js-switch-alt');
  var initAlt = new Switchery(elemAlt);

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      if (!Session.get('currentScenario') && !Session.get('connectivityMatrixScenarioTurn') && !Session.get('probabilityMatrixScenarioTurn')) return;
      if (this.$('#turn').val() == '') {
        var currentScenario = Session.get('currentScenario');
        Session.set('turn', currentScenario.turn);
      }
      var results = calculations(Session.get('currentScenario'), Session.get('connectivityMatrixScenarioTurn'), Session.get('probabilityMatrixScenarioTurn'));
      buildInfluenceDependenceUser(results.infDepCurrentUser);
      buildProbabilityUser(results.probabilityCurrentUser);
      buildInfluenceDependenceGlobal(results.infDepGlobal);
      buildProbabilityGlobal(results.probabilityGlobal);
    }
  });
});

Template.results.events({
  'click #complete_values': function (event, instance) {
    Meteor.call('updateCompletedValues', Session.get('active_scenario'), Meteor.userId(), 'Yes');
    toastr.options = {"timeOut": "8000", "progressBar": true};
    toastr.success('You can still update the values until the owner of the scenario changes the turn or finishes the evaluation', 'Evaluation confirmed');
  },
  'change #turn': function (event, instance) {
    var turn = instance.$(event.target).val();
    Session.set('turn', parseInt(turn));
  },
  'change .js-switch-obj': function (event, instance) {
    var checked = instance.$(event.target)[0].checked;
    if (checked) {
      instance.$('#collapseObjectives').collapse('show');
    } else {
      instance.$('#collapseObjectives').collapse('hide');
    }
  },
  'change .js-switch-alt': function (event, instance) {
    var checked = instance.$(event.target)[0].checked;
    if (checked) {
      instance.$('#collapseAlternatives').collapse('show');
    } else {
      instance.$('#collapseAlternatives').collapse('hide');
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
    if (infDepGlobal.length === 0 || objNamesGlobal.length === 0) return;
    var objCoord = [];
    _.each(infDepGlobal, function (coordinates, key) {
      objCoord.push({'objName': objNamesGlobal[key].objName, 'coordinates': coordinates.toString().replace(',', ', ')});
    });
    return objCoord;
  },
  probCoord: function () {
    var probGlobal = Session.get('probGlobal');
    var altNamesGlobal = Session.get('altNamesGlobal');
    if (probGlobal.length === 0 || altNamesGlobal.length === 0) return;
    var probCoord = [];
    _.each(probGlobal, function (coordinates, key) {
      probCoord.push({'altName': altNamesGlobal[key].altName, 'probability': coordinates.toString().replace(',', ', ')});
    });
    return probCoord;
  }
});