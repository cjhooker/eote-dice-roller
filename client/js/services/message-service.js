appModule.service("messageService", [function () {
    var nextLocalMessageId = 1;
    var listenerFunctions = [];

    this.getNextMessageId = function () {
        return 'msg-' + gapi.hangout.getLocalParticipant().id + '-' + nextLocalMessageId++;
    }

    this.createMessage = function(type, data) {
        var message = {
            messageId: this.getNextMessageId(),
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

    this.sendHtmlMessage = function(messageHtml) {
        var data = {
            html: messageHtml
        }
        this.sendMessage("html", data);
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
