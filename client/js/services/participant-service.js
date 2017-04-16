appModule.service("participantService", ["socketService", function (socketService) {
    var participants = [];
    var currentParticipantId = null;

    socketService.on("participants", function (updatedParticipants) {
        participants = updatedParticipants;
    });

    socketService.on("join", function (participantId) {
        currentParticipantId = participantId;
    });

    this.getParticipant = function (participantId) {
        return participants.filter(function (p) { return p.participantId === participantId; })[0];
    }

    this.getCurrentParticipant = function () {
        return participants.filter(function (p) { return p.participantId === currentParticipantId; })[0];
    }
}]);
