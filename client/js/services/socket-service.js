appModule.service("socketService", [function () {
    var socket = io();

    this.emit = function(eventName, eventData) {
        socket.emit(eventName, eventData);
    }

    this.on = function(eventName, eventHandler) {
        socket.on(eventName, eventHandler);
    }
}]);
