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

function clearQty(color) {
	document.getElementById("qty" + color).value = 0;
}

function roll() {
	var messages = new Array();
	if (gapi.hangout.data.getValue('messages')) {
		messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	}
	
	var rollResult = "";
	for (var color in dice) {
		for (var i=0; i < document.getElementById("qty" + color).value; i++) {
			rollResult += getRoll(dice[color]);
		}
	}
	
	var message = new Object();
	message.type = "roll";
	message.participantId = gapi.hangout.getLocalParticipant().id;
	message.data = new Object();
	// message.data.die = color;
	// message.data.quantity = 1;
	message.data.result = rollResult;
	messages.push(message);
	
	gapi.hangout.data.setValue("messages", JSON.stringify(messages));
}

// function rollDie(color) {
	// var messages = new Array();
	// if (gapi.hangout.data.getValue('messages')) {
		// messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	// }
	
	// var message = new Object();
	// message.type = "roll";
	// message.participantId = gapi.hangout.getLocalParticipant().id;
	// message.data = new Object();
	// message.data.die = color;
	// message.data.quantity = 1;
	// message.data.result = getRoll(dice[color]);
	// messages.push(message);
	
	// gapi.hangout.data.setValue("messages", JSON.stringify(messages));
// }

function getRoll(die) {
	var rand =  Math.floor(Math.random() * die.length);
	return die[rand];
}

function clearMessages() {
	gapi.hangout.data.setValue("messages", JSON.stringify(new Array()));
}

function displayMessage(message) {
	var output = "";
	
	if (message.type = "roll") {
		output += gapi.hangout.getParticipantById(message.participantId).person.displayName + ": ";
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
			// Show the new message at the top
			outputArea.innerHTML = displayMessage(messages[i]) + outputArea.innerHTML;
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