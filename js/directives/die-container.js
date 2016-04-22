appModule.directive("dieContainer", [function () {
    return {
        restrict: 'E',
        templateUrl: "die-container.html",
        scope: {
            color: '@color',
            quantity: '=quantity',
            numericDieType: '=numericDieType'
        },
        link: function ($scope, element, attrs) {

            // Note that this is here rather than just a $watch to avoid an infinite loop of sending and receiving notifications
            // when another player changes the quantity.
            var checkShouldNotify = function () {
                if ($scope.$parent.shouldSendDiceQuantityNotifications()) {
                    var newQuantity = {}
                    newQuantity[$scope.color] = $scope.quantity;
                    var diceQuantities = Object.assign($scope.$parent.diceQuantities, newQuantity);
                    gapi.hangout.data.setValue("diceQuantities-" + $scope.$parent.controlDiceForPlayer,
                        JSON.stringify(diceQuantities));
                    console.log('sent from directive diceQuantities-' + $scope.$parent.controlDiceForPlayer);
                }
            }

            $scope.clearQty = function () {
                $scope.quantity = 0;
                checkShouldNotify();
            }

            $scope.changeQty = function (delta) {
                $scope.quantity += delta;
                if ($scope.quantity < 0) {
                    $scope.quantity = 0;
                }
                if ($scope.quantity > 99) {
                    $scope.quantity = 99;
                }
                checkShouldNotify();
            }
        }
    };
}]);