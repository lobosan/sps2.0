Template.probCoordGlobal.helpers({
    probCoord: function () {
        if (Session.get('probGlobal') && Session.get('altNamesGlobal')) {
            var probGlobal = Session.get('probGlobal');
            var altNamesGlobal = Session.get('altNamesGlobal');
            var probCoord = [];
            _.each(probGlobal, function (coordinates, key) {
                probCoord.push({'altName': altNamesGlobal[key].altName, 'probability': coordinates.toString().replace(',', ', ')});
            });
        }
        return probCoord;
    }
});