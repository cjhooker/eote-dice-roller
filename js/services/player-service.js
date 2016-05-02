appModule.service("playerService", ["messageService", "diceService", function (messageService, diceService) {

    this.getPlayerList = function () {
        return gapi.hangout.getEnabledParticipants().map(mapParticipantToPlayer);
    }

    this.getCurrentPlayer = function () {
        var participant = gapi.hangout.getLocalParticipant()
        return mapParticipantToPlayer(participant);
    }

    this.getPlayer = function (playerId) {
        var participant = gapi.hangout.getParticipantById(playerId);
        return mapParticipantToPlayer(participant);
    }

    this.getDiceForPlayer = function (playerId) {
        debugLog("getDiceForPlayer " + this.getPlayer(playerId).name);
        var diceQuantities = gapi.hangout.data.getValue("diceQuantities-" + playerId);
        if (diceQuantities == undefined) {
            return diceService.getEmptyDiceQuantities();
        } else {
            return JSON.parse(diceQuantities);
        }
    }

    this.setDiceForPlayer = function (playerId, diceQuantities) {
        debugLog("setDiceForPlayer " + this.getPlayer(playerId).name);
        gapi.hangout.data.setValue("diceQuantities-" + playerId, JSON.stringify(diceQuantities));
    }

    function mapParticipantToPlayer(participant) {
        return {id: participant.id, name: participant.person.displayName};
    }
}]);
