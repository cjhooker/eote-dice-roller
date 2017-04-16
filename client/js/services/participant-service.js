appModule.service("participantService", [function () {

    this.getParticipant = function(participantId) {
        return gapi.hangout.getParticipantById(participantId).person;
    }

}]);
