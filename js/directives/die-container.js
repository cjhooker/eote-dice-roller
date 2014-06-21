appModule.directive("dieContainer", [function () {
    return {
        restrict: 'E',
        templateUrl: "[[BASE_PATH]]templates/die-container.html",
        scope: {
            color: '@color',
        },
        link: function ($scope, element, attrs) {
            $scope.clearQty = function (color) {
                if (color) {
                    // Clear the quantity for a specific die
                    document.getElementById("qty" + color).value = 0;
                } else {
                    // Clear the quantity for all dice
                    for (var c in dice) {
                        document.getElementById("qty" + c).value = 0;
                    }
                }
            }

            $scope.changeQty = function (color, delta) {
                var textBox = document.getElementById("qty" + color)
                if (!isNaN(textBox.value)) {
                    textBox.value = parseInt(textBox.value) + delta;
                    if (parseInt(textBox.value) < 0) {
                        textBox.value = 0;
                    }
                }
            }

        }
    };
}]);