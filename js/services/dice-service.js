appModule.service("diceService", ["messageService", function (messageService) {

    this.dice = {
        "Green": ["S", "S", "SS", "A", "A", "SA", "AA", ""],
        "Yellow": ["S", "S", "SS", "SS", "A", "SA", "SA", "SA", "AA", "AA", "X", ""],
        "Purple": ["F", "FF", "T", "T", "T", "TT", "FT", ""],
        "Red": ["F", "F", "FF", "FF", "T", "T", "FT", "FT", "TT", "TT", "D", ""],
        "Boost": ["S", "SA", "AA", "A", "", ""],
        "Setback": ["F", "F", "T", "T", "", ""],
        "Force": ["B", "B", "B", "B", "B", "B", "BB", "W", "W", "W", "WW", "WW"]
    };

    /***** Public Methods *****/

    // Roll a standard, non-Star Wars die (e.g. d100)
    // Append some text afterwards if specified. E.g. "%" after a d100 roll
    this.rollStandardDie = function (maxValue, followingText) {

        var roll = Math.floor(Math.random() * maxValue) + 1;

        var message = {
            messageId: messageService.getNextMessageId(),
            type: "html",
            participantId: gapi.hangout.getLocalParticipant().id,
            data: { html: "<span class='standard-die-roll'>" + roll + followingText + "</span>" }
        };

        gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
    }

    // Roll all the Star Wars dice the user has selected
    this.roll = function (diceQuantities, numericDieType) {
        var diceResults = [];

        for (var color in diceQuantities) {
            var qty = diceQuantities[color];
            for (var i = 0; i < qty; i++) {
                if (color == 'Numeric') {
                    var result = Math.floor(Math.random() * numericDieType) + 1;
                    if (numericDieType == 100) { result += "%"; }

                    diceResults.push({ die: color.substring(0, 1), result: result });
                    //this.rollStandardDie(numericDieType, '');
                }
                else {
                    diceResults.push({ die: color.substring(0, 1), result: getRoll(this.dice[color]) });
                }
            }
        }

        if (diceResults.length > 0) {
            var message = new Object();
            message.messageId = messageService.getNextMessageId();
            message.type = "roll";
            message.participantId = gapi.hangout.getLocalParticipant().id;
            message.data = new Object();
            message.data.diceResults = diceResults;
            message.data.overallResult = calculateOverallRollResult(diceResults);

            gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        }
    }

    /***** Private Methods *****/

    // Randomly return the value for one side of the given Star Wars die
    function getRoll(die) {
        var rand = Math.floor(Math.random() * die.length);
        return die[rand];
    }

    // Based on array of results from individual dice,
    // do all the cancellations and figure out the end result
    function calculateOverallRollResult(diceResults) {
        var result = "";
        var allResults = ""
        for (var i = 0; i < diceResults.length; i++) {
            allResults += diceResults[i].result;
        }

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
}]);