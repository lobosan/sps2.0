Template.results.helpers({
    turns: function () {
        var turn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
        var turns = [];
        for (var i = 1; i <= turn; i++) {
            turns.push({turn: i});
        }
        return turns;
    }
});

Template.results.onRendered(function () {
    var elemObj = this.find('.js-switch-obj');
    var initObj = new Switchery(elemObj);

    var elemAlt = this.find('.js-switch-alt');
    var initAlt = new Switchery(elemAlt);

    Tracker.autorun(function () {
        if (this.$('#turn').val() == '')
            Session.set('turn', Scenarios.findOne({_id: Session.get('active_scenario')}).turn);
        var results = calculations();
        buildInfluenceDependenceUser(results.infDepCurrentUser);
        buildProbabilityUser(results.probabilityCurrentUser);
        buildInfluenceDependenceGlobal(results.infDepGlobal);
        buildProbabilityGlobal(results.probabilityGlobal);
    });
});

Template.results.events({
    'click #complete_values': function (evt, tmpl) {
        Meteor.call('updateCompletedValues', Session.get('active_scenario'), Meteor.userId(), 'Yes');
        toastr.options = {"timeOut": "8000", "progressBar": true};
        toastr.success('You can still update the values until the owner of the scenario changes the turn or finishes the evaluation', 'Evaluation confirmed');
    },
    'change #turn': function (evt, tmpl) {
        var turn = $(evt.target).val();
        Session.set('turn', parseInt(turn));
    }
});