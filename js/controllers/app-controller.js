appModule.controller("appController", ["$scope", "$compile", "diceService", "messageService",
    function ($scope, $compile, diceService, messageService) {
        var outputArea = angular.element(document.getElementById('outputArea'));

        $scope.destiny = "";

        $scope.alertMessage = "";

        $scope.clearAllQtys = function () {
            for (var c in diceService.dice) {
                document.getElementById("qty" + c).value = 0;
            }
        }

        $scope.insertBreak = function () {
            outputArea.prepend("<hr/>");
        }

        $scope.clearMessages = function () {
            outputArea.html("");
        }

        $scope.roll = function () {
            var qty = 0;
            for (var color in diceService.dice) {
                qty += document.getElementById("qty" + color).value;
            }

            if (qty > 0) {
                $scope.alertMessage = "";

                diceService.roll();

                if (document.getElementById("resetAfterRoll").checked) {
                    $scope.clearAllQtys();
                }
            } else {
                $scope.alertMessage = "No dice selected!";
            }
        }

        $scope.rollStandardDie = function (maxValue, postText) {
            $scope.alertMessage = "";
            diceService.rollStandardDie(maxValue, postText);
        }

        $scope.displayMessage = function (message) {
            var messageDisplay = angular.element("<message-display message='message'></message-display>");
            var newScope = $scope.$new(true);
            newScope.message = message;
            var el = $compile(messageDisplay)(newScope);
            outputArea.prepend(messageDisplay);
        };

        $scope.addDestiny = function () {
            var destiny = "";
            if (gapi.hangout.data.getValue('destiny')) {
                destiny = gapi.hangout.data.getValue('destiny');
            }

            destiny += "L";

            // Set the destiny in the shared state
            gapi.hangout.data.setValue("destiny", destiny);
            //console.log("set destiny to " + destiny);

            // Also add a message telling everyone that someone added a Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: gapi.hangout.getLocalParticipant().id,
                data: {
                    html: "Destiny added"
                }
            };

            // Set the message in the shared state
            gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        }

        $scope.removeDestiny = function () {
            var destiny = "";
            if (gapi.hangout.data.getValue('destiny')) {
                destiny = gapi.hangout.data.getValue('destiny');
            }

            destiny = destiny.substr(0, destiny.length - 1);

            // Set the destiny in the shared state
            gapi.hangout.data.setValue("destiny", destiny);
            //console.log("set destiny to " + destiny);

            // Also add a message telling everyone that someone removed a Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: gapi.hangout.getLocalParticipant().id,
                data: {
                    html: "Destiny removed"
                }
            };

            // Set the message in the shared state
            gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        }

        $scope.toggleDestiny = function (position) {
            //console.log("toggleDestiny called for position " + position);
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
            //console.log("set destiny to " + destiny);

            // Also add a message telling everyone that someone flipped Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: gapi.hangout.getLocalParticipant().id,
                data: {
                    html: "Destiny used: " + (destinyUsed == "L" ? "Light" : "Dark")
                }
            };

            // Set the message in the shared state
            gapi.hangout.data.setValue(message.messageId, JSON.stringify(message));
        }

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
                        //localMessages.push(message);
                        $scope.displayMessage(message);
                        break;
                    case "destiny":
                        // The current state of the destiny tracker
                        $scope.destiny = "";
                        if (gapi.hangout.data.getValue('destiny')) {
                            $scope.destiny = gapi.hangout.data.getValue('destiny');
                        }
                        //console.log(destiny);
                        //document.getElementById("destinyTokenContainer").innerHTML = getDestinyHtml(destiny);
                        break;
                }
            }
        });
    }]);