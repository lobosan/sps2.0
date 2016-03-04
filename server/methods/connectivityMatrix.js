Meteor.methods({
  removeAllConMat: function () {
    return ConnectivityMatrix.remove({});
  }
});