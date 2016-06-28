Template.scenarios.onCreated(function () {
  this.ready = new ReactiveVar();
  this.autorun(() => {
    let handleScenarios = SubsManagerScenarios.subscribe('scenarioList');
    this.ready.set(handleScenarios.ready());
  });
});

isUserJoined = function (rowId) {
  var scenarioRow = Scenarios.findOne({_id: rowId});
  var guests_ids = [];
  _.each(scenarioRow.guests, function (guest) {
    guests_ids.push(guest.userid);
  });

  if (Meteor.userId() === scenarioRow.author) {
    return true;
  } else if (_.contains(guests_ids, Meteor.userId())) {
    return true;
  } else {
    return false;
  }
};

Template.joinScenario.helpers({
  isJoined: function () {
    return isUserJoined(this._id);
  },
  isAuthor: function () {
    var scenarioRow = Scenarios.findOne({_id: this._id});
    if (Meteor.userId() === scenarioRow.author) return true;
  },
  isGuest: function () {
    var scenarioRow = Scenarios.findOne({_id: this._id});
    var guests_ids = [];
    _.each(scenarioRow.guests, function (guest) {
      guests_ids.push(guest.userid);
    });
    if (_.contains(guests_ids, Meteor.userId())) return true;
  }
});

Template.scenarios.events({
  'click tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    if (isUserJoined(rowData._id)) {
      if (!(Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
        Session.update('active_scenario', rowData._id);
      } else {
        Session.setAuth('active_scenario', rowData._id);
      }
      $('.scenario-name').removeClass('active-scenario');
      $(event.currentTarget).find('i').addClass('active-scenario');
    }
  }
});

Template.joinScenario.events({
  'click .join-scenario': function (evt, tmpl) {
    if (!(Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
      Session.update('active_scenario', tmpl.data._id);
    } else {
      Session.setAuth('active_scenario', tmpl.data._id);
    }
    $('.scenario-name').removeClass('active-scenario');
    $(evt.currentTarget).find('i').addClass('active-scenario');

    Scenarios.update({_id: this._id}, {
      $push: {
        'guests': {
          'userid': Meteor.userId(),
          'complete_values': 'No'
        }
      }
    });
  },
  'click .leave-scenario': function (evt, tmpl) {
    Session.update('active_scenario', null);
    Session.setAuth('active_scenario', null);
    $('.scenario-name').removeClass('active-scenario');

    Scenarios.update({_id: this._id}, {
      $pull: {
        'guests': {
          'userid': Meteor.userId()
        }
      }
    });
  }
});

Template.evaluateScenario.events({
  'click .evaluate': function (evt, tmpl) {
    if (!(Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
      Session.update('active_scenario', tmpl.data._id);
    } else {
      Session.setAuth('active_scenario', tmpl.data._id);
    }
  }
});

Template.resultsScenario.events({
  'click .results': function (evt, tmpl) {
    if (!(Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
      Session.update('active_scenario', tmpl.data._id);
    } else {
      Session.setAuth('active_scenario', tmpl.data._id);
    }
  }
});

AutoForm.hooks({
  insertScenarioForm: {
    onSuccess: function (operation, result, template) {
      toastr.options = {"timeOut": "5000", "progressBar": true};
      toastr.success('The scenario has been added successfully', 'Scenario created');
    },
    after: {
      insert: function (error, result, template) {
        if (!error) {
          if (!(Session.get('active_scenario') === undefined || Session.get('active_scenario') === null)) {
            Session.update('active_scenario', result);
          } else {
            Session.setAuth('active_scenario', result);
          }
          $('#addScenario').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          FlowRouter.go('objectives');
        } else {
          return false;
        }
      }
    }
  }
});