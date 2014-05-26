var outputArea = document.getElementById('outputArea');

function showParticipants() {
    var participants = gapi.hangout.getParticipants();

    var retVal = '<p>Participants: </p><ul>';

    for (var index in participants) {
        var participant = participants[index];

        if (!participant.person) {
            retVal += '<li>A participant not running this app</li>';
        }
        retVal += '<li>' + participant.person.displayName + '</li>';
    }

    retVal += '</ul>';

    var div = document.getElementById('participantsDiv');

    div.innerHTML = retVal;
}

function rollGreen() {
	gapi.hangout.data.setValue("setGreen", "Green rolled at " + (new Date()).toLocaleTime() + "<br/>");
}

function init() {
    // When API is ready...
    gapi.hangout.onApiReady.add(
        function (eventObj) {
            if (eventObj.isApiReady) {
                document.getElementById('showParticipants')
                  .style.visibility = 'visible';
                document.getElementById('rollGreen')
                  .style.visibility = 'visible';
			}
        });
}

var onStateChange = function(eventObj) {
	var updates = '';
	for (var i = 0; i < eventObj.addedKeys.length; ++i) {
		updates += 'Added: ' + eventObj.addedKeys[i].key + ', ' +
			eventObj.addedKeys[i].value + ', ' +
			eventObj.addedKeys[i].timestamp + '<br/>';
	}
	for (var j = 0; j < eventObj.removedKeys.length; ++j) {
		updates += 'Removed: ' + eventObj.removedKeys[j] + '<br/>';
	}
	outputArea.innerHTML += updates;
	state_ = eventObj.state;
	metadata_ = eventObj.metadata;
};

gapi.hangout.data.onStateChanged.add(onStateChange);

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);