Template.connectivity.onRendered(function () { // Runs when the DOM is ready

    var elem = this.find('.js-switch-obj');
    var init = new Switchery(elem);

    var myData = [];  // Need this to create instance
    var container = document.getElementById('connectivity-matrix');

    var scenarioTurn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
    var numObj = ConnectivityMatrix.find({user_id: Meteor.userId(), turn: scenarioTurn}).count();

    var columns = [];
    var arrayRowsCols = [];

    for (var i = 1; i <= numObj; i++) {
        columns.push({
            'data': 'o'+i,
            'type': 'dropdown',
            'source': ['0', '1'],
            'strict': true,
            'allowInvalid': false
        });
        arrayRowsCols.push('Obj'+i);
    }

    var hot = new Handsontable(container, { // Create Handsontable instance
        data: myData,
        colHeaders: arrayRowsCols,
        rowHeaders: arrayRowsCols,
        height: '450',
        width: $('.container').width(),
        maxRows: numObj,
        maxCols: numObj,
        columns: columns,
        cells: function (r, c, prop) {
            var cellProperties = {};
            for (var i = 0; i < numObj; i++) {
                if (r === i && c === i) {
                    cellProperties.readOnly = true;
                    cellProperties.type = 'text';
                }
            }
            return cellProperties;
        },
        afterChange: function (change, source) {  // 'change' is an array of arrays.
            if (source !== 'loadData') {  // Don't need to run this when data is loaded
                for (i = 0; i < change.length; i++) {   // For each change, get the change info and update the record
                    var rowNum = change[i][0]; // Which row it appears on Handsontable
                    var row = myData[rowNum];  // Now we have the whole row of data, including _id
                    var key = change[i][1];  // Handsontable docs calls this 'prop'
                    var oldVal = change[i][2];
                    var newVal = change[i][3];
                    var setModifier = {$set: {}};   // Need to build $set object
                    setModifier.$set[key] = newVal; // So that we can assign 'key' dynamically using bracket notation of JavaScript object
                    ConnectivityMatrix.update(row._id, setModifier);
                }
            }
        }
    });

    this.autorun(function () {  // Tracker function for reactivity
        var scenarioTurn = Scenarios.findOne({_id: Session.get('active_scenario')}).turn;
        myData = ConnectivityMatrix.find({scenario_id: Session.get('active_scenario'), turn: scenarioTurn, user_id: Meteor.userId()}, {sort: {created_at: 1}}).fetch();  // Tie in our data
        hot.loadData(myData);
    });
});

Template.connectivity.events({
    'click #remove-cm': function () {
        Meteor.call('removeAllConMat');
        Meteor.call('removeAllProbMat');
        Scenarios.update({_id: Session.get('active_scenario')}, {$set: {state: 'Open', turn: 0}});
        Router.go('adminScenario');
    }
});