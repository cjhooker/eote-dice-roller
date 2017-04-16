appModule.service("destinyService", ["messageService", function (messageService) {
    var listenerFunctions = [];
    var destiny = "";

    this.addDestiny = function () {
        destiny += "L";
        gapi.hangout.data.setValue("destiny", destiny);
        this.receiveDestiny(destiny);
        messageService.sendMessage("Destiny added");
    }

    this.removeDestiny = function() {
        destiny = destiny.substr(0, destiny.length - 1);
        gapi.hangout.data.setValue("destiny", destiny);
        this.receiveDestiny(destiny);
        messageService.sendMessage("Destiny removed");
    }

    this.toggleDestiny = function(position) {
        var destinyUsed = destiny.charAt(position);

        if (destinyUsed == "L") {
            destiny = replaceAt(destiny, position, "D");
        } else {
            destiny = replaceAt(destiny, position, "L");
        }

        gapi.hangout.data.setValue("destiny", destiny);

        this.receiveDestiny(destiny);
        messageService.sendMessage("Destiny used: " + (destinyUsed == "L" ? "Light" : "Dark"));
    }

    this.receiveDestiny = function(destiny) {
        // Execute each listener function
        for (var i = 0; i < listenerFunctions.length; i++) {
            listenerFunctions[i](destiny);
        }
    }

    // Ability to add a listener for when destiny updates are received
    this.listeners = {
        add: function(listenerFunction) {
            listenerFunctions.push(listenerFunction);
        }
    }
}]);
