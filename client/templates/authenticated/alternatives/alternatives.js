Template.alternativesTable.onCreated(function () {
  let self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    let handleAlternatives = SubsManagerAlternatives.subscribe('alternativeList', Session.get('active_scenario'));
    self.ready.set(handleAlternatives.ready());
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