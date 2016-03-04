Meteor.methods({
  removeAllProbMat: function () {
    return ProbabilityMatrix.remove({});
  }
});