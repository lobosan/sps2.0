Template.objectivesAccordion.onCreated(function () {
  let self = this;
  self.isActiveScenarioReady = new ReactiveVar();
  self.isObjectiveListReady = new ReactiveVar();
  self.autorun(function () {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleObjectiveList = SubsManagerObjectives.subscribe('objectiveList', activeScenario);
    self.isActiveScenarioReady.set(handleActiveScenario.ready());
    self.isObjectiveListReady.set(handleObjectiveList.ready());
  });
});

Template.alternativesAccordion.onCreated(function () {
  let self = this;
  self.isActiveScenarioReady = new ReactiveVar();
  self.isAlternativeListReady = new ReactiveVar();
  self.autorun(function () {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleAlternativeList = SubsManagerAlternatives.subscribe('alternativeList', activeScenario);
    self.isActiveScenarioReady.set(handleActiveScenario.ready());
    self.isAlternativeListReady.set(handleAlternativeList.ready());
  });
});

Template.objectivesAccordion.helpers({
  objectivesList: function () {
    let activeScenario = Session.get('active_scenario');
    if (activeScenario) {
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
      var objectives = Objectives.find({scenario_id: activeScenario, turn: {$lte: turn}}).fetch();
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
  }
});

Template.alternativesAccordion.helpers({
  alternativesList: function () {
    let activeScenario = Session.get('active_scenario');
    if (activeScenario) {
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
      var alternatives = Alternatives.find({scenario_id: activeScenario, turn: {$lte: turn}}).fetch();
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
  }
});