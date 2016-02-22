Template.probability.onRendered(function () {

    var elemObj = this.find('.js-switch-obj');
    var initObj = new Switchery(elemObj);

    var elemAlt = this.find('.js-switch-alt');
    var initAlt = new Switchery(elemAlt);

    var myData = [];  // Need this to create instance
    var container = document.getElementById('probability-matrix');

    var scenarioTurn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
    var numAlt = ProbabilityMatrix.find({user_id: Meteor.userId(), turn: scenarioTurn}).count();
    var numObj = ConnectivityMatrix.find({user_id: Meteor.userId(), turn: scenarioTurn}).count();

    var columns = [];
    var colHeaders = [];
    var rowHeaders = [];

    for (var i = 1; i <= numObj; i++) {
        columns.push({
            'data': 'p' + i,
            'validator': /^[0-9][0-9]?$|^100$/,
            'allowInvalid': false
        });
        colHeaders.push('Obj' + i + ' %');
    }

    for (var i = 1; i <= numAlt; i++) {
        rowHeaders.push('Alt' + i);
    }

    var hot = new Handsontable(container, { // Create Handsontable instance
        data: myData,
        colHeaders: colHeaders,
        rowHeaders: rowHeaders,
        height: '450',
        width: $('.container').width(),
        maxRows: numAlt,
        maxCols: numObj,
        columns: columns,
        afterChange: function (change, source) {  // "change" is an array of arrays.
            if (source !== 'loadData') {  // Don't need to run this when data is loaded
                for (i = 0; i < change.length; i++) {   // For each change, get the change info and update the record
                    var rowNum = change[i][0]; // Which row it appears on Handsontable
                    var row = myData[rowNum];  // Now we have the whole row of data, including _id
                    var key = change[i][1];  // Handsontable docs calls this "prop"
                    var oldVal = change[i][2];
                    var newVal = change[i][3];
                    var setModifier = {$set: {}};   // Need to build $set object
                    setModifier.$set[key] = newVal; // So that we can assign 'key' dynamically using bracket notation of JavaScript object
                    ProbabilityMatrix.update(row._id, setModifier);
                }
            }
        }
    });

    this.autorun(function () {  // Tracker function for reactivity
        var scenarioTurn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
        myData = ProbabilityMatrix.find({scenario_id: Session.get('active_scenario'), turn: scenarioTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch();  // Tie in our data
        //myData = ProbabilityMatrix.find({user_id: Meteor.userId(), turn: scenarioTurn}, {sort: {order: 1}}).fetch();  // Tie in our data
        hot.loadData(myData);
    });
});

Template.probability.events({
    'click #remove-cm': function () {
        Meteor.call('removeAllConMat');
        Meteor.call('removeAllProbMat');
        Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Open', turn: 0}});
        Router.go('adminScenario');
    }
});

Template.switcheryObj.events({
    'change .js-switch-obj': function (evt) {
        var checked = $(evt.target)[0].checked;
        if (checked) {
            $('#collapseObjectives').collapse('show');
        } else {
            $('#collapseObjectives').collapse('hide');
        }
    }
});

Template.switcheryAlt.events({
    'change .js-switch-alt': function (evt) {
        var checked = $(evt.target)[0].checked;
        if (checked) {
            $('#collapseAlternatives').collapse('show');
        } else {
            $('#collapseAlternatives').collapse('hide');
        }
    }
});