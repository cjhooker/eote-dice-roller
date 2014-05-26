var outputArea = document.getElementById('outputArea');
var localMessages = new Array();

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
	var messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	messages.push("Green rolled at " + (new Date()).toLocaleTimeString() + "<br/>");
	gapi.hangout.data.setValue("messages", JSON.stringify(messages));
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
	//var updates = '';
	if (eventObj.addedKeys["messages"])
	{
		var eventMessages = JSON.parse(eventObj.addedKeys["messages"]);
		if (eventMessages.length > localMessages.length)
		{
			for (var i = localMessages.length; i < eventMessages.length; i++)
			{
				localMessages.push(eventMessages[i]);
				outputArea.innerHTML += eventMessages[i];
			}
		}
	}
	// for (var i = 0; i < eventObj.addedKeys.length; ++i) {
		// updates += 'Added: ' + eventObj.addedKeys[i].key + ', ' +
			// eventObj.addedKeys[i].value + ', ' +
			// eventObj.addedKeys[i].timestamp + '<br/>';
	// }
	// for (var j = 0; j < eventObj.removedKeys.length; ++j) {
		// updates += 'Removed: ' + eventObj.removedKeys[j] + '<br/>';
	// }
	
	// state_ = eventObj.state;
	// metadata_ = eventObj.metadata;
};

gapi.hangout.data.onStateChanged.add(onStateChange);

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);