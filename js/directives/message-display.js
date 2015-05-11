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
                "S": "success.png",
                "F": "failure.png",
                "A": "advantage.png",
                "T": "threat.png",
                "X": "triumph.png",
                "D": "despair.png",
                "B": "black-circle.png",
                "W": "white-circle.png"
            }
        }
    };
}]);