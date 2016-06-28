Template.objectivesTable.onCreated(function () {
  this.ready = new ReactiveVar();
  this.autorun(() => {
    let handleObjectives = SubsManagerObjectives.subscribe('objectiveList', Session.get('active_scenario'));
    this.ready.set(handleObjectives.ready());
  });
});

Template.objectivesTable.helpers({
  objectiveList: function () {
    return Objectives.find();
  }
});

Template.insertObjectiveForm.helpers({
  defaultValues: function () {
    var turn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
    turn++;
    return {scenario_id: Session.get('active_scenario'), turn: turn};
  }
});