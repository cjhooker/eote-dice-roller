appModule.controller("contentController", ["$scope", "$compile", function ($scope, $compile) {
    //$scope.displayMessage = function (message) {
    //    var messageDisplay = angular.element("<message-display message='message'></message-display>");
    //    var newScope = $scope.$new(true);
    //    newScope.message = message;
    //    var el = $compile(messageDisplay)(newScope);
    //    angular.element(document.getElementById("outputArea")).prepend(messageDisplay);
    //};

    //gapi.hangout.data.onStateChanged.add(function (stateChangedEvent) {
    //    // Loop through all the keys that were added to the shared state
    //    for (var i = 0; i < stateChangedEvent.addedKeys.length; i++) {
    //        var key = stateChangedEvent.addedKeys[i].key;
    //        var keyFirstPart = key.substring(0, key.indexOf("-") == -1 ? key.length : key.indexOf("-"));

    //        // The first part of the key will tell us what we need to do with it
    //        switch (keyFirstPart) {
    //            case "msg":
    //                // A message of any type to display in the main output area
    //                // e.g. the results of a die roll
    //                var message = JSON.parse(stateChangedEvent.addedKeys[i].value);
    //                localMessages.push(message);
    //                $scope.displayMessage(message);
    //                break;
    //            case "destiny":
    //                // The current state of the destiny tracker
    //                var destiny = "";
    //                if (gapi.hangout.data.getValue('destiny')) {
    //                    destiny = gapi.hangout.data.getValue('destiny');
    //                }
    //                //console.log(destiny);
    //                document.getElementById("destinyTokenContainer").innerHTML = getDestinyHtml(destiny);
    //                break;
    //        }
    //    }
    //});
}]);