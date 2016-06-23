Template.objectivesAccordion.onCreated(function () {
  let self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleObjectives = SubsManagerObjectives.subscribe('objectiveList', activeScenario);
    self.ready.set(handleActiveScenario.ready());
    self.ready.set(handleObjectives.ready());
  });
});

Template.alternativesAccordion.onCreated(function () {
  let self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    const activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    let handleActiveScenario = SubsManagerScenarios.subscribe('activeScenario', activeScenario);
    let handleAlternatives = SubsManagerAlternatives.subscribe('alternativeList', activeScenario);
    self.ready.set(handleActiveScenario.ready());
    self.ready.set(handleAlternatives.ready());
  });
});

Template.objectivesAccordion.helpers({
  objectivesList: function () {
    if (Session.get('active_scenario')) {
      var activeScenario = Scenarios.findOne({_id: Session.get('active_scenario')});
      var turn;
      if (FlowRouter.getRouteName() === 'results') {
        turn = Session.get('turn')
      } else {
        if (activeScenario) {
          turn = activeScenario.turn;
        } else {
          return;
        }
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
    } else {
      return;
    }
  }
});

Template.alternativesAccordion.helpers({
  alternativesList: function () {
    if (Session.get('active_scenario')) {
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
    } else {
      return;
    }
  }
});