appModule.service("messageService", [function () {
    var nextLocalMessageId = 1;
    var listenerFunctions = [];

    this.getNextMessageId = function () {
        return 'msg-' + gapi.hangout.getLocalParticipant().id + '-' + nextLocalMessageId++;
    }

    this.createMessage = function(messageHtml) {
        var message = {
            messageId: this.getNextMessageId(),
            type: "html",
            participantId: gapi.hangout.getLocalParticipant().id,
            data: {
                html: messageHtml
            }
        };

        return message;
    }

    this.sendMessage = function(messageHtml) {
        var message = this.createMessage(messageHtml);
        // Set the message in the shared state
        gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        this.receiveMessage(message);
    }

    this.receiveMessage = function(message) {
        // Execute each listener function
        for (var i = 0; i < listenerFunctions.length; i++) {
            listenerFunctions[i](message);
        }
    }

    // Ability to add a listener for when messages are received
    this.listeners = {
        add: function(listenerFunction) {
            listenerFunctions.push(listenerFunction);
        }
    }

}]);
