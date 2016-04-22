/* Code to mock Hangouts API so the app can be tested outside Hangouts */

var _data = new Object();
var _stateChangedFunction = function() {};

var gadgets = {
	util: {
		registerOnLoadHandler: function(func) {
			func();
		}
	}
};

var gapi = {
	hangout: {
		onApiReady: {
			add: function(func) {
				func(eventObj);
			}
		},
		data: {
			getValue: function(key) {
				return _data[key];
			},
			setValue: function (key, value) {
			    var valueToSet;
			    //if (typeof value === 'object') {
			    //    valueToSet = Object.assign({}, value);
			    //} else {
			    //    valueToSet = value;
			    //}
			    valueToSet = value;
				_data[key] = valueToSet;
				_stateChangedFunction({ addedKeys: [{ key: key, value: valueToSet }] });

			    // Need to re-transmit diceQuantities when you take control to simulate what happens
				// in app-controller for the other player.
				var keyFirstPart = key.split("-")[0];
				if (keyFirstPart == "controlDiceForPlayer") {
				    var controlledPlayerId = value;
				    if (controlledPlayerId != participant.id) {
				        var diceQuantities = JSON.parse(gapi.hangout.data.getValue("diceQuantities-" + controlledPlayerId));
				        if (diceQuantities != undefined) {
				            gapi.hangout.data.setValue("diceQuantities-" + controlledPlayerId, JSON.stringify(diceQuantities));
				        }
				    }
				}
			},
			//getKeys: function() {
			//    return Object.keys(_data);
			//},
			onStateChanged: {
				add: function(func) {
					_stateChangedFunction = func;
				}
			}
		},
		getLocalParticipant: function() {
			return participant;
		},
		getParticipantById: function(id) {
		    var result = enabledParticipants.filter(function (e) { return e.id == id; });
		    return result[0];
		},
		getEnabledParticipants: function () {
		    return enabledParticipants;
		},
		onEnabledParticipantsChanged: {
            add: function(func) {}
		}
	}
};

var participant = {
    id: 1234,
    person: {
        image: {
            url: "https://lh4.googleusercontent.com/-XlaUq1MC7PQ/AAAAAAAAAAI/AAAAAAAAAAA/UhEE5TO7Li8/s96-c/photo.jpg"
        },
        displayName: "Chris Hooker"
    }
};

var enabledParticipants = [
    participant,
    {
        id: 1,
        person: {
            image: {
                url: "images/han-solo.jpg"
            },
            displayName: "Han Solo"
        }
    },
    {
        id: 2,
        person: {
            image: {
                url: "images/princess-leia.jpg"
            },
            displayName: "Princess Leia"
        }
    }
];

var eventObj = {
	isApiReady: true
};

var getEmptyDiceQuantities = function () {
    return {
        "Green": 0,
        "Yellow": 0,
        "Purple": 0,
        "Red": 0,
        "Boost": 0,
        "Setback": 0,
        "Force": 0,
        "Success": 0,
        "Advantage": 0,
        "Triumph": 0,
        "Failure": 0,
        "Threat": 0,
        "Despair": 0,
        "Numeric": 0
    }
};

gapi.hangout.data.setValue("messages", JSON.stringify(new Array()))
gapi.hangout.data.setValue("diceQuantities-1", JSON.stringify(getEmptyDiceQuantities()))
gapi.hangout.data.setValue("diceQuantities-2", JSON.stringify(getEmptyDiceQuantities()))


