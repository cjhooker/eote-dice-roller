appModule.service("messageService", ["socketService", function (socketService) {
    var nextLocalMessageId = 1;
    var listenerFunctions = [];

    // When we receive a message from the server, notify any listeners
    socketService.on("message", function(message) {
        for (var i = 0; i < listenerFunctions.length; i++) {
            listenerFunctions[i](message);
        }
    });

    this.createMessage = function(type, data) {
        var message = {
            type: type,
            participantId: gapi.hangout.getLocalParticipant().id,
            data: data
        };

        return message;
    }

    this.sendMessage = function(type, data) {
        var message = this.createMessage(type, data);
        // Set the message in the shared state
        gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        this.receiveMessage(message);
    }

    // Ability to add a listener for when messages are received
    this.listeners = {
        add: function(listenerFunction) {
            listenerFunctions.push(listenerFunction);
        }
    }

}]);
