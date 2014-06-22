appModule.filter("destinyType", [function () {
    return function (input) {
        if (input == "L") { return "light"; }
        else { return "dark"; }
    }
}]);