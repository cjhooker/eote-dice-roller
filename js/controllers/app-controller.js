appModule.controller("appController", ["$scope", "$compile", "$timeout", "diceService",
    "messageService", "settingService", "playerService", "hangoutService",
    function ($scope, $compile, $timeout, diceService, messageService, settingService, playerService, hangoutService) {
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
        $scope.currentPlayer = playerService.getCurrentPlayer().id;
        $scope.controlDiceForPlayer = $scope.currentPlayer;
        $scope.controlsYourDice = [];

        $scope.imageSize = settingService.get("imageSize");

        $scope.imageSizeChange = function () {
            settingService.set("imageSize", $scope.imageSize);
        }

        $scope.init = function () {
            $scope.destiny = "";
            $scope.resetAfterRoll = false;

            // Set the dice quantities when the app first loads
            $scope.diceQuantities = new DiceQuantities();
            $scope.resetDiceQuantities();
            $scope.numericDieType = 100;
        }

        $scope.resetDiceQuantities = function () {
            for (var color in diceService.dice) {
                $scope.diceQuantities[color] = 0;
            }
            $scope.diceQuantities['Numeric'] = 0;

            // Note that this is here rather than just a $watch to avoid sending a notification in response to receiving
            // a notification when another player changes your quantity.
            playerService.setDiceForPlayer($scope.controlDiceForPlayer, $scope.diceQuantities);
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

        hangoutService.onEnabledParticipantsChanged(function (enabledParticipantsChangedEvent) {
            debugLog("enabledParticipants changed");
            $scope.playerList = enabledParticipantsChangedEvent.enabledParticipants;
        });

        hangoutService.data.onStateChanged(function (stateChangedEvent) {
            // debugLog(JSON.stringify(stateChangedEvent));

            // Loop through all the keys that were added to the shared state
            for (var i = 0; i < stateChangedEvent.addedKeys.length; i++) {
                var key = stateChangedEvent.addedKeys[i].key;
                var keyFirstPart = key.split("-")[0];

                // The first part of the key will tell us what we need to do with it
                switch (keyFirstPart) {
                    case "msg":
                        // A message of any type to display in the main output area
                        // e.g. the results of a die roll
                        var message = JSON.parse(stateChangedEvent.addedKeys[i].value);
                        $timeout(function () {
                            $scope.displayMessage(message);
                        });
                        break;
                    case "destiny":
                        // The current state of the destiny tracker
                        var destiny = gapi.hangout.data.getValue('destiny');
                        $timeout(function () {
                            $scope.destiny = "";
                            if (destiny) {
                                $scope.destiny = destiny;
                            }
                        });
                        break;
                    case "diceQuantities":
                        // Don't bother processing updates that are from yourself
                        if (stateChangedEvent.metadata[key].lastWriter == $scope.currentPlayer) return;

                        var participantId = key.split("-")[1];
                        debugLog("received diceQuantities for " + playerService.getPlayer(participantId).name);
                        // Only update the dice UI if the update is for the dice you are currently controlling
                        if (participantId == $scope.controlDiceForPlayer) {
                            var diceQuantities = JSON.parse(stateChangedEvent.addedKeys[i].value);
                            $timeout(function () {
                                $scope.diceQuantities = diceQuantities;
                            });
                        }
                        break;
                    case "controlDiceForPlayer":
                        // Don't bother processing updates that are from yourself
                        if (stateChangedEvent.metadata[key].lastWriter == $scope.currentPlayer) return;

                        var controllingPlayerId = key.split("-")[1];
                        var controlledPlayerId = stateChangedEvent.addedKeys[i].value;

                        // Don't include yourself in the list
                        if (controllingPlayerId == $scope.currentPlayer) {
                            break;
                        }

                        $timeout(function () {
                            // If the player was controlling your dice, but switched to someone else, remove them from your list
                            var controllingPlayerIndex = $scope.controlsYourDice.indexOf(controllingPlayerId)
                            if (controllingPlayerIndex != -1) {
                                $scope.controlsYourDice.splice(controllingPlayerIndex, 1);
                            }

                            // If the other player is now controlling your dice, add them to your list
                            if (controlledPlayerId == $scope.currentPlayer) {
                                $scope.controlsYourDice.push(controllingPlayerId);
                            }
                        });

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

        $scope.$watch("controlDiceForPlayer", function (newValue, oldValue) {
            // Make sure the other players are made aware of the change
            hangoutService.data.setValue("controlDiceForPlayer-" + $scope.currentPlayer, newValue);

            if (newValue != $scope.currentPlayer) {
                // If taking control of someone else, we also need to send our dice quantities so the value is stored
                playerService.setDiceForPlayer($scope.currentPlayer, $scope.diceQuantities);
            }

            // Get the dice that you are controlling
            $scope.diceQuantities = playerService.getDiceForPlayer(newValue);
        });

        // // Whether we should notify other players when we change dice quantities
        // $scope.shouldSendDiceQuantityNotifications = function () {
        //     return $scope.controlDiceForPlayer != $scope.currentPlayer || $scope.controlsYourDice.length > 0;
        // };

        // // Whenever the list of people controlling your dice changes, you need to transmit your list of diceQuantities
        // // so they have them.
        // $scope.$watchCollection("controlsYourDice", function (newValue, oldValue) {
        //     if (newValue.length > 0) {
        //         gapi.hangout.data.setValue("diceQuantities-" + $scope.currentPlayer, JSON.stringify($scope.diceQuantities));
        //     }
        // });

        // After everything is defined, call the init function
        $scope.init();

        //FAKE_CONTROLS_JS//
    }]);
