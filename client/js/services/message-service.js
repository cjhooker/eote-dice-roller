appModule.service("messageService", [function () {
    var nextLocalMessageId = 1;

    this.getNextMessageId = function () {
        return 'msg-' + gapi.hangout.getLocalParticipant().id + '-' + nextLocalMessageId++;
    }
}]);