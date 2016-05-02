        // Functions for controlling various fake functionality when not running in Hangouts

        $scope.fakeHanTakesControl = function () {
            gapi.hangout.data.setValue("controlDiceForPlayer-1", 1234);
        }

        $scope.fakeLeiaTakesControl = function () {
            gapi.hangout.data.setValue("controlDiceForPlayer-2", 1234);
        }

        $scope.fakeHanStopsControlling = function () {
            gapi.hangout.data.setValue("controlDiceForPlayer-1", 1);
        }

        $scope.fakeLeiaStopsControlling = function () {
            gapi.hangout.data.setValue("controlDiceForPlayer-2", 2);
        }

        $scope.fakeHanChangesDice = function () {
            var diceQuantities = playerService.getDiceForPlayer(1234);
            diceQuantities["Green"] += 1;
            gapi.hangout.fake.setLastWriter(1);
            playerService.setDiceForPlayer(1234, diceQuantities);
        }

        $scope.fakeLeiaChangesDice = function () {
            var diceQuantities = playerService.getDiceForPlayer(1234);
            diceQuantities["Purple"] += 1;
            gapi.hangout.fake.setLastWriter(2);
            playerService.setDiceForPlayer(1234, diceQuantities);
        }

        var seeDice = function (participantId) {
            var output = "";
            var diceQuantities = playerService.getDiceForPlayer(participantId);
            for (var prop in diceQuantities) {
                if ($scope.diceQuantities.hasOwnProperty(prop)) {
                    output += prop + ": " + diceQuantities[prop] + "\r\n";
                }
            }
            alert(output);
        }

        $scope.fakeSeeHansDice = function () {
            seeDice(1);
        }

        $scope.fakeSeeLeiasDice = function () {
            seeDice(2);
        }
