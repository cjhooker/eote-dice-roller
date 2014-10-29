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
            $scope.clearQty = function () {
                $scope.quantity = 0;
            }

            $scope.changeQty = function (delta) {
                $scope.quantity += delta;
                if ($scope.quantity < 0) {
                    $scope.quantity = 0;
                }
                if ($scope.quantity > 99) {
                    $scope.quantity = 99;
                }
            }

        }
    };
}]);