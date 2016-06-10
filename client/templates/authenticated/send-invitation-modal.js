Template.sendInvitationModal.events({
  'submit form' (event, template) {
    event.preventDefault();

    let userName = template.find("[name='userName']").value;
    let email = template.find("[name='emailAddress']").value;
    let role = template.find("[name='roles']").value;

    if (email && role !== "") {
      Meteor.call("sendInvitation", {
        userName: userName,
        email: email,
        role: role
      }, (error, response) => {
        if (error) {
          Bert.alert(error.reason, "warning");
        } else {
          $("#send-invitation-modal").modal('hide');
          $('.modal-backdrop').hide();
          Bert.alert("Invitation sent!", "success");
        }
      });
    } else {
      Bert.alert("Please set an email!", "warning");
    }
  }
});
