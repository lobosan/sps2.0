Template.objectivesAccordion.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('objectiveList', this.activeScenario());
  });
});

Template.alternativesAccordion.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('alternativeList', this.activeScenario());
  });
});

Template.objectivesAccordion.helpers({
  objectivesList: function () {
    let activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    var currentScenario = Scenarios.findOne({_id: activeScenario});
    var turn;

    if (FlowRouter.getRouteName() === 'results') {
      turn = Session.get('turn')
    } else {
      if (currentScenario) {
        turn = currentScenario.turn;
      } else {
        return;
      }
    }

    var objectives = Objectives.find({scenario_id: activeScenario, turn: {$lte: turn}, active: 'Yes'}).fetch();
    var objectivesList = [];
    var objectivesNames = [];
    var index = 1;
    _.each(objectives, function (objective) {
      objectivesList.push({index: index, name: objective.name, description: objective.description, turn: objective.turn});
      objectivesNames.push({objName: objective.name});
      index++;
    });
    Session.set('objNamesGlobal', objectivesNames);
    return objectivesList;
  }
});

Template.alternativesAccordion.helpers({
  alternativesList: function () {
    let activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    var currentScenario = Scenarios.findOne({_id: activeScenario});
    var turn;

    if (FlowRouter.getRouteName() === 'results') {
      turn = Session.get('turn');
    } else {
      if (currentScenario) {
        turn = currentScenario.turn;
      } else {
        return;
      }
    }

    var alternatives = Alternatives.find({scenario_id: activeScenario, turn: {$lte: turn}, active: 'Yes'}).fetch();
    var alternativesList = [];
    var alternativesNames = [];
    var index = 1;
    _.each(alternatives, function (alternative) {
      alternativesList.push({index: index, name: alternative.name, description: alternative.description, turn: alternative.turn});
      alternativesNames.push({altName: alternative.name});
      index++;
    });
    Session.set('altNamesGlobal', alternativesNames);
    return alternativesList;
  }
});