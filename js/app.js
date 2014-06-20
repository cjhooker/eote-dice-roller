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

/******************************************************************************************/
/*** Helper Methods ***/

var getNextMessageId = function () {
    var nextLocalMessageId = 1;
    return function () {
        return 'msg-' + gapi.hangout.getLocalParticipant().id + '-' + nextLocalMessageId++;
    };
}(); // immediately execute to return function with access to closure scope

function replaceAt(str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length);
}

/******************************************************************************************/
/*** UI Methods ***/

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

function insertBreak() {
    outputArea.innerHTML = "<hr/>" + outputArea.innerHTML;
}

function clearMessages() {
    localMessages = new Array();
    outputArea.innerHTML = "";
}

function showAlertMessage(message) {
    document.getElementById("alertMessage").innerHTML = message;
}

function clearAlertMessage() {
    document.getElementById("alertMessage").innerHTML = "";
}

/******************************************************************************************/
/*** Destiny Methods ***/

function addDestiny() {
    var destiny = "";
    if (gapi.hangout.data.getValue('destiny')) {
        destiny = gapi.hangout.data.getValue('destiny');
    }

    destiny += "L";

    // Set the destiny in the shared state
    gapi.hangout.data.setValue("destiny", destiny);

    // Also add a message telling everyone that someone added a Destiny token
    var message = {
        messageId: getNextMessageId(),
        type: "html",
        participantId: gapi.hangout.getLocalParticipant().id,
        data: {
            html: "Destiny added"
        }
    };

    // Set the message in the shared state
    gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));

}

function removeDestiny() {
    var destiny = "";
    if (gapi.hangout.data.getValue('destiny')) {
        destiny = gapi.hangout.data.getValue('destiny');
    }

    destiny = destiny.substr(0, destiny.length - 1);

    // Set the destiny in the shared state
    gapi.hangout.data.setValue("destiny", destiny);

    // Also add a message telling everyone that someone removed a Destiny token
    var message = {
        messageId: getNextMessageId(),
        type: "html",
        participantId: gapi.hangout.getLocalParticipant().id,
        data: {
            html: "Destiny removed"
        }
    };

    // Set the message in the shared state
    gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));

}

function toggleDestiny(position) {
    var destiny = "";

    if (gapi.hangout.data.getValue('destiny')) {
        destiny = gapi.hangout.data.getValue('destiny');
    }

    var destinyUsed = destiny.charAt(position);

    if (destinyUsed == "L") {
        destiny = replaceAt(destiny, position, "D");
    } else {
        destiny = replaceAt(destiny, position, "L");
    }

    // Set the destiny in the shared state
    gapi.hangout.data.setValue("destiny", destiny);

    // Also add a message telling everyone that someone flipped Destiny token
    var message = {
        messageId: getNextMessageId(),
        type: "html",
        participantId: gapi.hangout.getLocalParticipant().id,
        data: {
            html: "Destiny used: " + (destinyUsed == "L" ? "Light" : "Dark") 
        }
    };

    // Set the message in the shared state
    gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
}

/******************************************************************************************/
/*** Dice Methods ***/

function rollStandardDie(maxValue, postText) {

    clearAlertMessage();

    var roll = Math.floor(Math.random() * maxValue) + 1;

    // Build new message
    var message = { messageId: getNextMessageId(), type: "html", participantId: gapi.hangout.getLocalParticipant().id, data: { html: roll + postText } };

    // Set the message in the shared state
    gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
}

function roll() {
    /* Roll all the Star Wars dice */

    clearAlertMessage();

    // Build arrays of dice rolled and their results
    var diceRolled = new Array();
    var diceResults = new Array();

    for (var color in dice) {
        var qty = document.getElementById("qty" + color).value;
        for (var i = 0; i < qty; i++) {
            diceRolled.push(color.substring(0, 1));
            diceResults.push(getRoll(dice[color]));
        }
    }

    if (diceRolled.length > 0) {
        // Build the message object for this roll
        var message = new Object();
        message.messageId = getNextMessageId();
        message.type = "roll";
        message.participantId = gapi.hangout.getLocalParticipant().id;
        message.data = new Object();
        message.data.diceRolled = diceRolled;
        message.data.diceResults = diceResults;
        message.data.overallResult = calculateOverallRollResult(diceResults);

        // Set the message in the shared state
        gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));

        if (document.getElementById("clearAfterRoll").checked) {
            clearQty();
        }
    } else {
        showAlertMessage("No dice selected!");
    }
}

function getRoll(die) {
    var rand = Math.floor(Math.random() * die.length);
    return die[rand];
}

function calculateOverallRollResult(diceResults) {
    /* Based on array of results from individual dice,
       do all the cancellations and figure out the end result */

    var result = "";
    var allResults = diceResults.join("");
    var successes = (allResults.match(/S/g) || []).length;
    var failures = (allResults.match(/F/g) || []).length;
    var advantages = (allResults.match(/A/g) || []).length;
    var threats = (allResults.match(/T/g) || []).length;
    var triumphs = (allResults.match(/X/g) || []).length;
    var despairs = (allResults.match(/D/g) || []).length;
    var darkSide = (allResults.match(/B/g) || []).length;
    var lightSide = (allResults.match(/W/g) || []).length;

    // Triumphs and despairs also count as successes and failures
    successes += triumphs;
    failures += despairs;

    if (successes > failures) {
        successes = successes - failures;
        failures = 0;
    } else {
        //failures = 1;
        failures = failures - successes;
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
    result += Array(triumphs + 1).join("X");
    result += Array(despairs + 1).join("D");
    result += Array(darkSide + 1).join("B");
    result += Array(lightSide + 1).join("W");

    return result;
}

/******************************************************************************************/
/*** HTML Methods ***/

function getMessageHtml(message) {
    var results = "";
    var person = gapi.hangout.getParticipantById(message.participantId).person;

    switch (message.type) {
        case "roll":
            var results = "<div class='dice-results'>";
            for (var i = 0; i < message.data.diceResults.length; i++) {
                results += getDieImageHtml(message.data.diceResults[i], message.data.diceRolled[i]);
            }
            results += "</div><div class='overall-results'>";
            results += getImagesHtml(message.data.overallResult) + "</div>";
            break;
        case "html":
            results = message.data.html;
            break;
    }

    return getResultsWrapperHtml(person).replace("{{RESULTS}}", results);
}

function getResultsWrapperHtml(person) {
    var output = "";
    output += "<div class='row-wrapper'>";
    output += "<div class='image-wrapper'><img class='person-image' src='" + person.image.url + "' title='" + person.displayName + "' /></div>";
    output += "<div class='results-wrapper'>{{RESULTS}}</div></div>";
    return output;
}

function getDestinyHtml(destiny) {
    var output = "";

    for (var i = 0; i < destiny.length; i++) {
        if (destiny.charAt(i) == "L") {
            output += "<img src='https://eote-hangouts-dice-roller.googlecode.com/git/images/destiny-light.png' class='destiny-token' onclick='toggleDestiny(" + i + ")' />";
        } else {
            output += "<img src='https://eote-hangouts-dice-roller.googlecode.com/git/images/destiny-dark.png' class='destiny-token' onclick='toggleDestiny(" + i + ")' />";
        }
    }

    return output;
}

function getDieImageHtml(result, die) {
    return "<img class='symbol' src='" + baseUrl + "images/" + die + "-" + result + ".png'/>";
}

function getImagesHtml(result) {
    var output = "";

    for (var i = 0; i < result.length; i++) {
        output += "<img class='symbol' src='" + baseUrl + "images/" + symbols[result[i]] + "'/>";
    }

    return output;
}

/******************************************************************************************/
/*** Event Handlers ***/

gapi.hangout.data.onStateChanged.add(function (stateChangedEvent) {
    // Loop through all the keys that were added to the shared state
    for (var i = 0; i < stateChangedEvent.addedKeys.length; i++) {
        var key = stateChangedEvent.addedKeys[i].key;
        var keyFirstPart = key.substring(0, key.indexOf("-") == -1 ? key.length : key.indexOf("-"));

        // The first part of the key will tell us what we need to do with it
        switch (keyFirstPart) {
            case "msg":
                // A message of any type to display in the main output area
                // e.g. the results of a die roll
                var message = JSON.parse(stateChangedEvent.addedKeys[i].value);
                localMessages.push(message);
                outputArea.innerHTML = getMessageHtml(message) + outputArea.innerHTML;
                break;
            case "destiny":
                // The current state of the destiny tracker
                var destiny = "";
                if (gapi.hangout.data.getValue('destiny')) {
                    destiny = gapi.hangout.data.getValue('destiny');
                }
                console.log(destiny);
                document.getElementById("destinyTokenContainer").innerHTML = getDestinyHtml(destiny);
                break;
        }
    }
});

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);