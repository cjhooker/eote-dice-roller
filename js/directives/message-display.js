appModule.directive("messageDisplay", ["$sanitize", function ($sanitize) {
    return {
        restrict: 'E',
        templateUrl: "message-display.html",
        scope: {
            //person: '@person',
            message: '=message'
        },
        link: function ($scope, element, attrs) {
            var message = $scope.message;
            $scope.person = gapi.hangout.getParticipantById(message.participantId).person;
            //function getMessageHtml(message) {
            var results = "";
            var person = gapi.hangout.getParticipantById(message.participantId).person;

            $scope.symbols = symbols;

            //switch (message.type) {
            //    case "roll":
            //        var results = "<div class='dice-results'>";
            //        for (var i = 0; i < message.data.diceResults.length; i++) {
            //            results += getDieImageHtml(message.data.diceResults[i], message.data.diceRolled[i]);
            //        }
            //        results += "</div><div class='overall-results'>";
            //        results += getImagesHtml(message.data.overallResult) + "</div>";
            //        break;
            //    case "html":
            //        results = message.data.html;
            //        break;
            //}

            $scope.results = results;
            //}
        }
    };
}]);