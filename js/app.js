var outputArea = document.getElementById('outputArea');
var localMessages = new Array();

function init() {
    // When API is ready...
    gapi.hangout.onApiReady.add(
        function (eventObj) {
            if (eventObj.isApiReady) {
                document.getElementById('buttonContainer')
                  .style.visibility = 'visible';
			}
        });
}

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
	var messages = new Array();
	if (gapi.hangout.data.getValue('messages')) {
		messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	}
	
	var message = new Object();
	message.type = "roll";
	message.participant = gapi.hangout.getLocalParticipant();
	message.data = new Object();
	message.data.die = "green";
	message.data.quantity = 1;
	message.data.result = "SSAAA";
	messages.push(message);
	
	gapi.hangout.data.setValue("messages", JSON.stringify(messages));
}

function clearMessages() {
	gapi.hangout.data.setValue("messages", JSON.stringify(new Array()));
}

function displayMessage(message) {
	var output = "";
	
	if (message.type = "roll") {
		output += message.participant.person.displayName + ": ";
		output += message.data.die + ": ";
		output += message.data.result + "<br/>";
	} else if (message.type = "html") {
		output += message.data.html;
	}
	
	return output;
}

var onStateChange = function(eventObj) {
	var messages = new Array();
	if (gapi.hangout.data.getValue('messages')) {
		messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	}

	if (messages.length > localMessages.length)	{
		for (var i = localMessages.length; i < messages.length; i++) {
			localMessages.push(messages[i]);
			outputArea.innerHTML += displayMessage(messages[i]);
		}
	}
	
	if (messages.length == 0) {
		localMessages = new Array();
		outputArea.innerHTML = "";
	}
	
};

gapi.hangout.data.onStateChanged.add(onStateChange);

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);