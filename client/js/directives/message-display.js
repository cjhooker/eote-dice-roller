appModule.directive("messageDisplay", ["$sanitize", "settingService", function ($sanitize, settingService) {
    return {
        restrict: 'E',
        templateUrl: "message-display.html",
        scope: {
            message: '=message',
        },
        link: function ($scope, element, attrs) {

            $scope.person = gapi.hangout.getParticipantById($scope.message.participantId).person;

            $scope.symbols = {
                "S": "Success.png",
                "F": "Failure.png",
                "A": "Advantage.png",
                "T": "Threat.png",
                "X": "Triumph.png",
                "D": "Despair.png",
                "B": "black-circle.png",
                "W": "white-circle.png"
            }
        }
    };
}]);