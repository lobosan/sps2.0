chartsDataUser = function (userId, connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn) {
  var conMatrixCurrentUser = [];
  _.find(connectivityMatrixScenarioTurn, function (item) {
    if (item.user_id === userId)
      conMatrixCurrentUser.push(item);
  });

  // Influence
  var influence = [];
  for (var i = 0; i < conMatrixCurrentUser.length; i++) {
    var temp = [];
    for (var j = 1; j <= conMatrixCurrentUser.length; j++) {
      if ((conMatrixCurrentUser[i]['o' + j]) != 'x')
        temp.push(conMatrixCurrentUser[i]['o' + j]);
    }
    var sum = _.reduce(temp, function (memo, num) {
      return parseInt(memo) + parseInt(num);
    }, 0);
    influence.push(sum);
  }
  // console.log('influence: ' + influence);

  // Dependence
  var dependence = [];
  var tempDep = [];
  for (var i = 0; i < conMatrixCurrentUser.length; i++) {
    tempDep.push(_.pluck(conMatrixCurrentUser, 'o' + (i + 1)));
  }
  _.each(tempDep, function (dep) {
    dependence.push(_.reduce(_.without(dep, 'x'), function (memo, num) {
      return parseInt(memo) + parseInt(num);
    }, 0));
  });
  // console.log('dependence: ' + dependence);

  // Influencia Dependencia
  var infDepCurrentUser = [];
  for (var r = 0; r < influence.length; r++) {
    infDepCurrentUser.push([dependence[r], influence[r]]);
  }
  // console.table(infDepCurrentUser);

  // Vector 1
  var vector1 = [];
  for (var k = 0; k < influence.length; k++) {
    vector1.push(Math.sqrt(Math.pow(influence[k], 2) + Math.pow(dependence[k], 2)));
  }
  // console.log('vector1: ' + vector1);

  // Vector 2
  var vector2 = [];
  var infProm = (influence.length - 1) / 2;
  for (var m = 0; m < influence.length; m++) {
    if (influence[m] > (infProm) && dependence[m] < infProm) vector2.push(1);
    else if (influence[m] > (infProm) && dependence[m] > infProm) vector2.push(0.75);
    else if (influence[m] < (infProm) && dependence[m] > infProm) vector2.push(0.5);
    else vector2.push(0.25);
  }
  // console.log('vector2: ' + vector2);

  // Vector 3
  var vector3 = [];
  for (var n = 0; n < influence.length; n++) {
    vector3.push((vector1[n] * vector2[n]));
  }
  // console.log('vector3: ' + vector3);

  // Evi
  var probMatrixCurrentUser = [];
  _.find(probabilityMatrixScenarioTurn, function (item) {
    if (item.user_id === userId)
      probMatrixCurrentUser.push(item);
  });

  var evi = [];
  for (var p = 0; p < probMatrixCurrentUser.length; p++) {
    var tempEvi = 0;
    for (var q = 0; q < conMatrixCurrentUser.length; q++) {
      tempEvi += ((parseInt(probMatrixCurrentUser[p]['p' + (q + 1)])) / 100) * vector3[q];
    }
    evi.push(tempEvi);
  }
  // console.log('evi: ' + evi);

  // Probability
  var probabilityCurrentUser = [];
  var sumEvi = _.reduce(evi, function (memo, num) {
    return parseFloat(memo) + parseFloat(num);
  }, 0);
  _.each(evi, function (e) {
    if (sumEvi === 0) {
      probabilityCurrentUser.push((e / 1) * 100);
    } else {
      probabilityCurrentUser.push((e / sumEvi) * 100);
    }
    
  });
  // console.log(probabilityCurrentUser);

  return {
    infDepCurrentUser: infDepCurrentUser,
    probabilityCurrentUser: probabilityCurrentUser
  }
};

calculations = function (currentScenario, connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn) {
  var authorId = currentScenario.author;
  var guests = currentScenario.guests;
  var participantIds = [authorId];
  _.each(guests, function (guest) {
    participantIds.push(guest.userid);
  });
  var otherParticipants = _.without(participantIds, Meteor.userId());

  var chartsCurrentUser = chartsDataUser(Meteor.userId(), connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn);

  var infDepParticipants = [chartsCurrentUser.infDepCurrentUser];
  _.each(otherParticipants, function (participantId) {
    infDepParticipants.push(chartsDataUser(participantId, connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn).infDepCurrentUser);
  });
  // console.log(infDepParticipants);

  // Influencia Dependencia Global
  var numParticipants = infDepParticipants.length;
  var infDepGlobal = [];
  for (var j = 0; j < infDepParticipants[0].length; j++) {
    var temp1 = 0;
    var temp2 = 0;
    for (var i = 0; i < numParticipants; i++) {
      temp1 += infDepParticipants[i][j][0];
      temp2 += infDepParticipants[i][j][1];
    }
    infDepGlobal.push([temp1 / numParticipants, temp2 / numParticipants]);
  }
  Session.set('infDepGlobal', infDepGlobal);
  // console.log(infDepGlobal);

  // Probabilidad Global
  var probabilityParticipants = [chartsCurrentUser.probabilityCurrentUser];
  _.each(otherParticipants, function (participantId) {
    probabilityParticipants.push(chartsDataUser(participantId, connectivityMatrixScenarioTurn, probabilityMatrixScenarioTurn).probabilityCurrentUser);
  });

  var probabilityGlobal = [];
  for (var j = 0; j < probabilityParticipants[0].length; j++) {
    var temp = 0;
    _.each(probabilityParticipants, function (probPart) {
      temp += probPart[j];
    });
    probabilityGlobal.push(temp / participantIds.length);
  }
  Session.set('probGlobal', probabilityGlobal);
  // console.log(probabilityGlobal);
  var total = _.reduce(probabilityGlobal, function (sum, el) {
    return sum + el;
  }, 0);
  // console.log(total);

  return {
    infDepCurrentUser: chartsCurrentUser.infDepCurrentUser,
    probabilityCurrentUser: chartsCurrentUser.probabilityCurrentUser,
    infDepGlobal: infDepGlobal,
    probabilityGlobal: probabilityGlobal
  };
};