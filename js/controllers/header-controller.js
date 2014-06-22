appModule.controller("headerController", ["$scope", "diceService", function ($scope, diceService) {

    //$scope.alertMessage = "";

    //$scope.clearAllQtys = function () {
    //    for (var c in dice) {
    //        document.getElementById("qty" + c).value = 0;
    //    }
    //}

    //$scope.insertBreak = function () {
    //    outputArea.innerHTML = "<hr/>" + outputArea.innerHTML;
    //}

    //$scope.clearMessages = function () {
    //    localMessages = new Array();
    //    outputArea.innerHTML = "";
    //}

    //$scope.roll = function () {
    //    var qty = 0;
    //    for (var color in dice) {
    //        qty += document.getElementById("qty" + color).value;
    //    }

    //    if (qty > 0) {
    //        $scope.alertMessage = "";

    //        diceService.roll();

    //        if (document.getElementById("resetAfterRoll").checked) {
    //            $scope.clearAllQtys();
    //        }
    //    } else {
    //        $scope.alertMessage = "No dice selected!";
    //    }
    //}

    //$scope.rollStandardDie = function (maxValue, postText) {
    //    $scope.alertMessage = "";
    //    diceService.rollStandardDie(maxValue, postText);
    //}
}]);