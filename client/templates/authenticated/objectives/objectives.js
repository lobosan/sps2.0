Template.objectives.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('objectiveList', this.activeScenario());
  });
});

Template.objectives.helpers({
  objectiveList: function () {
    return Objectives.find();
  }
});

Template.insertObjectiveForm.helpers({
  defaultValues: function () {
    var activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    var currentScenario = Scenarios.findOne({_id: activeScenario});
    var turn = currentScenario.turn;
    turn++;
    return {
      scenario_id: activeScenario,
      turn: turn
    };
  }
});