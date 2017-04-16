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
			setValue: function(key, value) {
				_data[key] = value;
				_stateChangedFunction({addedKeys: [{key: key, value: value}]});
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
			return participant;
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

var eventObj = {
	isApiReady: true
};

gapi.hangout.data.setValue("messages", JSON.stringify(new Array()))
