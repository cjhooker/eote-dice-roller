appModule.service("hangoutService", function() {
    this.onEnabledParticipantsChanged = function(eventHandler) {
        gapi.hangout.onEnabledParticipantsChanged.add(eventHandler);
    }

    this.data = {
        onStateChanged: function (eventHandler) {
            gapi.hangout.data.onStateChanged.add(eventHandler);
        },
        setValue: function (key, value) {
            gapi.hangout.data.setValue(key, value);
        }
    }
});
