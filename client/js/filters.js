appModule.filter("destinyType", [function () {
    return function (input) {
        if (input == "L") { return "light"; }
        else { return "dark"; }
    }
}]);

appModule.filter("dieName", [function () {
    return function (input) {
        switch (input) {
            case "Green":
                return "Ability";
            case "Yellow":
                return "Proficiency";
            case "Purple":
                return "Difficulty";
            case "Red":
                return "Challenge";
            case "Boost":
                return "Boost";
            case "Setback":
                return "Setback";
            case "Force":
                return "Force";
        }
        return input;
    }
}]);

appModule.filter("symbolName", [function () {
    return function (input) {
        switch (input) {
            case "S":
                return "Success";
            case "A":
                return "Advantage";
            case "F":
                return "Failure";
            case "T":
                return "Threat";
            case "D":
                return "Despair";
            case "X":
                return "Triumph";
            case "W":
                return "Light";
            case "B":
                return "Dark";
        }
        return input;
    }
}]);

appModule.filter("dieResultSummary", ["$filter", function ($filter) {
    return function (input) {
        if (!input) { return ""; }
        var output = "";
        resultCounts = {};

        for (var i = 0; i < input.length; i++) {
            if (!(input[i] in resultCounts)) {
                resultCounts[input[i]] = 1;
            } else {
                resultCounts[input[i]]++;
            }
        }

        for (var key in resultCounts) {
            output += resultCounts[key] + " " + $filter("symbolName")(key) + " ";
        }

        if (output == "") { output = "Blank"; }

        return output;
    }
}]);