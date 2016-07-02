Meteor.methods({
  updateConnectivityCell: function (rowId, setModifier) {
    check(rowId, String);
    check(setModifier, Object);
    return ConnectivityMatrix.update(rowId, setModifier);
  },
  removeAllConMat: function () {
    return ConnectivityMatrix.remove({});
  }
});