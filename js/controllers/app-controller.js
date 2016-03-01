appModule.controller("appController", ["$scope", "$compile", "diceService", "messageService", "settingService", "playerService",
    function ($scope, $compile, diceService, messageService, settingService, playerService) {
        var getOutputArea = function () { return angular.element(document.getElementById('outputArea')) };

        settingService.set("imageSize", "medium");

        $scope.showMore = false;
        $scope.showSettings = false;

        $scope.imageSizeOptions = [
                {
                    "id": "small",
                    "label": "Small"
                },
                {
                    "id": "medium",
                    "label": "Medium"
                },
                {
                    "id": "large",
                    "label": "Large"
                }
        ];

        $scope.playerList = playerService.getPlayerList();
        $scope.controlDiceForPlayer = playerService.getCurrentPlayer().id;
        $scope.controlsYourDice = "nobody";

        $scope.imageSize = settingService.get("imageSize");

        $scope.imageSizeChange = function () {
            settingService.set("imageSize", $scope.imageSize);
        }

        $scope.init = function () {
            $scope.destiny = "";
            $scope.resetAfterRoll = false;

            // Set the dice quantities when the app first loads
            $scope.diceQuantities = [];
            $scope.resetDiceQuantities();
            $scope.numericDieType = 100;
        }

        $scope.resetDiceQuantities = function () {
            for (var color in diceService.dice) {
                $scope.diceQuantities[color] = 0;
            }
            $scope.diceQuantities['Numeric'] = 0;
        }

        $scope.resetSymbolQuantites = function () {
            $scope.diceQuantities['Success'] = 0;
            $scope.diceQuantities['Advantage'] = 0;
            $scope.diceQuantities['Triumph'] = 0;
            $scope.diceQuantities['Failure'] = 0;
            $scope.diceQuantities['Threat'] = 0;
            $scope.diceQuantities['Despair'] = 0;
        }

        $scope.insertBreak = function () {
            getOutputArea().prepend("<hr/>");
        }

        $scope.clearMessages = function () {
            getOutputArea().html("");
        }

        $scope.roll = function () {
            var qty = 0;
            for (var color in diceService.dice) {
                qty += $scope.diceQuantities[color];
            }

            qty += $scope.diceQuantities['Numeric'];

            if (qty > 0) {
                diceService.roll($scope.diceQuantities, $scope.numericDieType, $scope.rollCaption);

                if ($scope.resetAfterRoll) {
                    $scope.resetDiceQuantities();
                    $scope.rollCaption = "";
                }
            } else {
                getOutputArea().prepend("<div class='alert'>No dice selected!</div>");
            }
        }

        $scope.displayMessage = function (message) {
            var messageDisplay = angular.element("<message-display message='message'></message-display>");
            var newScope = $scope.$new(true);
            newScope.message = message;
            var el = $compile(messageDisplay)(newScope);
            getOutputArea().prepend(messageDisplay);
        };

        $scope.addDestiny = function () {
            var destiny = "";
            if (gapi.hangout.data.getValue('destiny')) {
                destiny = gapi.hangout.data.getValue('destiny');
            }

            destiny += "L";

            // Set the destiny in the shared state
            gapi.hangout.data.setValue("destiny", destiny);

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

        $scope.toggleSettingsDisplay = function () {
            $scope.showSettings = !$scope.showSettings;
        };

        $scope.toggleMorePanel = function () {
            $scope.showMore = !$scope.showMore;
            if (!$scope.showMore) {
                $scope.rollCaption = "";
                $scope.resetSymbolQuantites();
            }
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
                        $scope.displayMessage(message);
                        break;
                    case "destiny":
                        // The current state of the destiny tracker
                        $scope.destiny = "";
                        if (gapi.hangout.data.getValue('destiny')) {
                            $scope.destiny = gapi.hangout.data.getValue('destiny');
                        }
                        break;
                }
            }
        });

        //$scope.displayDebug = function () {
        //    var keys = gapi.hangout.data.getKeys();
        //    for (var i = 0; i < keys.length; i++) {
        //        alert(keys[i] + ": " + gapi.hangout.data.getValue(keys[i]));
        //    }
        //}

        // After everything is defined, call the init function
        $scope.init();
    }]);