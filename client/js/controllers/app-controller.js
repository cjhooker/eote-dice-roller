appModule.controller("appController",
    ["$scope", "$compile", "diceService", "messageService", "settingService", "destinyService",
    function ($scope, $compile, diceService, messageService, settingService, destinyService) {
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

        $scope.imageSize = settingService.get("imageSize");

        $scope.imageSizeChange = function () {
            settingService.set("imageSize", $scope.imageSize);
        }

        $scope.init = function () {
            $scope.destiny = "";
            $scope.resetAfterRoll = false;

            // Set the dice quantities when the app first loads
            $scope.diceQuantities = [];
            //$scope.symbolQuantities = [];
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
            destinyService.addDestiny();
        }

        $scope.removeDestiny = function () {
            destinyService.removeDestiny();
        }

        $scope.toggleDestiny = function (position) {
            destinyService.toggleDestiny(position);
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

        messageService.listeners.add(function (message) {
            $scope.displayMessage(message);
        });

        destinyService.listeners.add(function(destiny) {
            $scope.destiny = destiny;
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
