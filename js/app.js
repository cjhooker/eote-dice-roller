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
	if (color) {
		// Clear the quanity for a specific die
		document.getElementById("qty" + color).value = 0;
	} else {
		// Clear the quanity for all dice
		for (var c in dice) {
			document.getElementById("qty" + c).value = 0;
		}
	}
}

function roll() {
	// Get messages list from shared state
	var messages = new Array();
	if (gapi.hangout.data.getValue('messages')) {
		messages = JSON.parse(gapi.hangout.data.getValue('messages'));
	}
	
	// Build arrays of dice rolled and their results
	var diceRolled = new Array();
	var diceResults = new Array();
	
	for (var color in dice) {
		var qty = document.getElementById("qty" + color).value;
		for (var i=0; i < qty; i++) {
			diceRolled.push(color.substring(0, 1));
			diceResults.push(getRoll(dice[color]));
		}
	}
	
	// Build the message object for this roll
	var message = new Object();
	message.type = "roll";
	message.participantId = gapi.hangout.getLocalParticipant().id;
	message.data = new Object();
	message.data.diceRolled = diceRolled;
	message.data.diceResults = diceResults;
	message.data.overallResult = getOverallResult(diceResults);
	messages.push(message);
	
	// Set the message in the shared state
	gapi.hangout.data.setValue("messages", JSON.stringify(messages));
}

// Based on array of results from individual dice,
// do all the cancellations and figure out the end result
function getOverallResult(diceResults) {
	var result = "";
	var allResults = diceResults.join("");
	var successes = (allResults.match(/S/g) || []).length;
	var failures = (allResults.match(/F/g) || []).length;
	var advantages = (allResults.match(/A/g) || []).length;
	var threats = (allResults.match(/T/g) || []).length;
	var triumphs = (allResults.match(/\*/g) || []).length;
	var despairs = (allResults.match(/X/g) || []).length;
	
	// Triumphs and despairs also count as successes and failures
	successes += triumphs;
	failures += despairs;
	
	if (successes > failures) {
		successes = successes - failures;
		failures = 0;
	} else {
		failures = 1;
		successes = 0;
	}

	if (threats > advantages) {
		threats = threats - advantages;
		advantages = 0;
	} else {
		advantages = advantages - threats;
		threats = 0;
	}
	
	// Array(n).join(char) will produce a string of n-1 chars
	result += Array(successes + 1).join("S");
	result += Array(failures + 1).join("F");
	result += Array(advantages + 1).join("A");
	result += Array(threats + 1).join("T");
	result += Array(triumphs + 1).join("*");
	result += Array(despairs + 1).join("X");
	
	return result;
}

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
		var person = gapi.hangout.getParticipantById(message.participantId).person;
		output += "<img class='person-image' src='" + person.image.url + "'/> ";
		for (var i = 0; i < message.data.diceResults.length; i++) {
			output += getImagesHtml(message.data.diceResults[i], message.data.diceRolled[i]);
		}
		output += "<br/>";
		output += getImagesHtml(message.data.overallResult) + "<br/>";
	} else if (message.type = "html") {
		output += message.data.html;
	}
	
	return output;
}

function getImagesHtml(result, die) {
	var output = "";
	
	if (die) { output += "<span class='die " + die + "'>"; }
	
	if (die && result.length == 0) {
		output += "<span class='empty-die'></span>";
	} else {
		for (var i = 0; i < result.length; i++) {
			output += "<img class='symbol' src='" + baseUrl + "/images/" + symbols[result[i]] + "'/>";
		}
	}
	
	if (die) { output += "</span>";	}	
	
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