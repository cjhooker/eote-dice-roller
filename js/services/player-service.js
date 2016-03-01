appModule.service("playerService", ["messageService", function (messageService) {

    this.getPlayerList = function () {
        return gapi.hangout.getEnabledParticipants();
    }

    this.getCurrentPlayer = function () {
        return gapi.hangout.getLocalParticipant();
    }
}]);