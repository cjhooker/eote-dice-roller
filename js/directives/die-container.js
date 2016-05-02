appModule.directive("dieContainer", ["playerService", function (playerService) {
    return {
        restrict: 'E',
        templateUrl: "die-container.html",
        scope: {
            color: '@color',
            quantity: '=quantity',
            numericDieType: '=numericDieType'
        },
        link: function ($scope, element, attrs) {

            // Note that this is here rather than just a $watch to avoid sending a notification in response to receiving
            // a notification when another player changes your quantity.
            var checkShouldNotify = function () {
                var newQuantity = {}
                newQuantity[$scope.color] = $scope.quantity;
                var diceQuantities = Object.assign($scope.$parent.diceQuantities, newQuantity);
                playerService.setDiceForPlayer($scope.$parent.controlDiceForPlayer, $scope.$parent.diceQuantities);
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
