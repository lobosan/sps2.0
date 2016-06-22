Template.objectivesAccordion.helpers({
  objectivesList: function () {
    var activeScenario = Scenarios.findOne({_id: Session.get('active_scenario')});
    var turn;
    if (FlowRouter.getRouteName() === 'results') {
      turn = Session.get('turn')
    } else {
      turn = activeScenario.turn;
    }
    var objectives = Objectives.find({scenario_id: Session.get('active_scenario'), turn: {$lte: turn}}).fetch();
    var objectivesList = [];
    var objectivesNames = [];
    var index = 1;
    _.each(objectives, function (objective) {
      objectivesList.push({index: index, name: objective.name, description: objective.description});
      objectivesNames.push({objName: objective.name});
      index++;
    });
    Session.set('objNamesGlobal', objectivesNames);
    return objectivesList;
  }
});

Template.alternativesAccordion.helpers({
  alternativesList: function () {
    var turn;
    if (FlowRouter.getRouteName() === 'results') {
      turn = Session.get('turn');
    } else {
      turn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
    }
    var alternatives = Alternatives.find({scenario_id: Session.get('active_scenario'), turn: {$lte: turn}}).fetch();
    var alternativesList = [];
    var alternativesNames = [];
    var index = 1;
    _.each(alternatives, function (alternative) {
      alternativesList.push({index: index, name: alternative.name, description: alternative.description});
      alternativesNames.push({altName: alternative.name});
      index++;
    });
    Session.set('altNamesGlobal', alternativesNames);
    return alternativesList;
  }
});