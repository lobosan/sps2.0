Template.alternativesTable.onCreated(function () {
  this.ready = new ReactiveVar();
  this.autorun(() => {
    let handleAlternatives = SubsManagerAlternatives.subscribe('alternativeList', Session.get('active_scenario'));
    this.ready.set(handleAlternatives.ready());
  });
});

Template.alternativesTable.helpers({
  alternativeList: function () {
    return Alternatives.find();
  }
});

Template.insertAlternativeForm.helpers({
  defaultValues: function () {
    var turn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
    turn++;
    return {scenario_id: Session.get('active_scenario'), turn: turn};
  }
});