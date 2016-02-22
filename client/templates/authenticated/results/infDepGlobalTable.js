Template.objCoordGlobal.helpers({
    objCoord: function () {
        if (Session.get('infDepGlobal') && Session.get('objNamesGlobal')) {
            var infDepGlobal = Session.get('infDepGlobal');
            var objNamesGlobal = Session.get('objNamesGlobal');
            var objCoord = [];
            _.each(infDepGlobal, function (coordinates, key) {
                objCoord.push({'objName': objNamesGlobal[key].objName, 'coordinates': coordinates.toString().replace(',', ', ')});
            });
        }
        return objCoord;
    }
});