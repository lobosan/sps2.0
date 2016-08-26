Template.alternatives.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('alternativeList', this.activeScenario());
  });
});

Template.alternatives.helpers({
  alternativeList: function () {
    return Alternatives.find();
  }
});

Template.insertAlternativeForm.helpers({
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