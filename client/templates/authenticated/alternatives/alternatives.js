Meteor.autosubscribe(function () {
   Meteor.subscribe('alternativeList', Session.get('active_scenario'));
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