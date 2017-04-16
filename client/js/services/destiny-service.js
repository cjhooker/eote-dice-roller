appModule.service("destinyService", ["messageService", "socketService", function (messageService, socketService) {
    var listenerFunctions = [];

    // When we receive a destiny message from the server, notify any listeners
    socketService.on("destiny", function(destiny) {
        for (var i = 0; i < listenerFunctions.length; i++) {
            listenerFunctions[i](destiny);
        }
    });

    this.addDestiny = function () {
        socketService.emit("destiny-add");
    }

    this.removeDestiny = function() {
        socketService.emit("destiny-remove");
    }

    this.toggleDestiny = function(position) {
        socketService.emit("destiny-toggle", position);
    }

    // Ability to add a listener for when destiny updates are received
    this.listeners = {
        add: function(listenerFunction) {
            listenerFunctions.push(listenerFunction);
        }
    }
}]);
