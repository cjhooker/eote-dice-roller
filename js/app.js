﻿function showParticipants() {
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
	var div = document.getElementById('outputArea');
	div.innerHTML += "Green rolled!<br/>";
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

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);