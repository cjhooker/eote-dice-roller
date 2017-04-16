appModule.service("settingService", [function () {
    var settings = {};

    this.get = function (settingName) {
        return settings[settingName];
    }

    this.set = function (settingName, value) {
        settings[settingName] = value;
    }
}]);