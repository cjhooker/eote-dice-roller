appModule.directive("messageDisplay", ["$sanitize", "settingService", "participantService",
        function ($sanitize, settingService, participantService) {
    return {
        restrict: 'E',
        templateUrl: "message-display.html",
        scope: {
            message: '=message',
        },
        link: function ($scope, element, attrs) {

            $scope.person = participantService.getParticipant($scope.message.participantId);

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
