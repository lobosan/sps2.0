Meteor.methods({
  updateProbabilityCell: function (rowId, setModifier) {
    check(rowId, String);
    check(setModifier, Object);
    return ProbabilityMatrix.update(rowId, setModifier);
  },
  removeAllProbMat: function () {
    return ProbabilityMatrix.remove({});
  }
});