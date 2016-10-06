Template.objectives.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('objectiveList', this.activeScenario());
  });
});

Template.objectives.helpers({
  objectiveList: function () {
    return Objectives.find({active: 'Yes'});
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

AutoForm.hooks({
  insertObjectiveForm: {
    before: {
      insert: function (doc) {
        var objectives = Objectives.find({scenario_id: doc.scenario_id}).count();
        var scenario = Scenarios.findOne({_id: doc.scenario_id});
        if (Roles.userIsInRole(scenario.author, 'public') && objectives >= 6) {
          $('#addObjective').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          toastr.options = {"timeOut": "6000", "progressBar": true};
          toastr.warning('Scenarios created by public users can only have up to 6 objectives', 'WARNING');
          return false;
        } else {
          return doc;
        }
      }
    }
  }
});