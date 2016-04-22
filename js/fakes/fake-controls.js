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
            var tempDiceQuantities = {};
            for (var prop in $scope.diceQuantities) {
                if ($scope.diceQuantities.hasOwnProperty(prop)) {
                    tempDiceQuantities[prop] = $scope.diceQuantities[prop] + 1;
                }
            }
            gapi.hangout.data.setValue("diceQuantities-1234", JSON.stringify(tempDiceQuantities));
        }

        $scope.fakeLeiaChangesDice = function () {
            var tempDiceQuantities = {};
            for (var prop in $scope.diceQuantities) {
                if ($scope.diceQuantities.hasOwnProperty(prop)) {
                    tempDiceQuantities[prop] = $scope.diceQuantities[prop] + 2;
                }
            }
            gapi.hangout.data.setValue("diceQuantities-1234", JSON.stringify(tempDiceQuantities));
        }
        
        var seeDice = function (participantId) {
            var output = "";
            var diceQuantities = JSON.parse(gapi.hangout.data.getValue("diceQuantities-" + participantId));
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