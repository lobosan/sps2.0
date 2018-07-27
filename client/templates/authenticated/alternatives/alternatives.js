Template.alternatives.onCreated(function () {
  this.activeScenario = () => Session.get('active_scenario');

  this.autorun(() => {
    this.subscribe('alternativeList', this.activeScenario());
  });
});

Template.alternatives.helpers({
  alternativeList: function () {
    return Alternatives.find({active: 'Yes'});
  }
});

Template.insertAlternativeForm.helpers({
  defaultValues: function () {
    var activeScenario = Session.get('active_scenario');
    if (!activeScenario) return;

    var currentScenario = Scenarios.findOne({_id: activeScenario});
    if (!currentScenario) return;
    var turn = currentScenario.turn;
    turn++;
    return {
      scenario_id: activeScenario,
      turn: turn
    };
  }
});

AutoForm.hooks({
  insertAlternativeForm: {
    before: {
      insert: function (doc) {
        var alternatives = Alternatives.find({scenario_id: doc.scenario_id}).count();
        var scenario = Scenarios.findOne({_id: doc.scenario_id});
        if (Roles.userIsInRole(scenario.author, 'public') && alternatives >= 6) {
          $('#addAlternative').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          toastr.options = {"timeOut": "6000", "progressBar": true};
          toastr.warning('Scenarios created by public users can only have up to 6 alternatives', 'WARNING');
          return false;
        } else {
          return doc;
        }
      }
    }
  }
});
