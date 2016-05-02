describe("appController", function() {

    beforeEach(module("appModule"));

    var appController, playerService, hangoutService, $scope;

    var _currentPlayer = { id: 999, name: "Current Player" };
    var _players = [_currentPlayer, {id: 888, name: "Chewbacca"}, {id: 777, name: "Luke Skywalker"}];

    beforeEach(module(function($provide) {
        // Mock the player service so we can control what data we are expecting
        $provide.service('playerService', function() {
            playerService = this;
            this.getCurrentPlayer = jasmine.createSpy('getCurrentPlayer').and.callFake(function() {
                return _currentPlayer;
            });
            this.getPlayerList = jasmine.createSpy('getPlayerList').and.callFake(function() {
                return _players;
            });
            this.setDiceForPlayer = jasmine.createSpy('setDiceForPlayer').and.callFake(function (playerId, diceQuantities) {
                return;
            });
        });

        // Mock the hangout service so that event handlers don't get set up globally on gapi.hangout
        $provide.service('hangoutService', function() {
            hangoutService = this;
            this.onEnabledParticipantsChanged = jasmine.createSpy('onEnabledParticipantsChanged');
            this.data = {}
            this.data.onStateChanged = jasmine.createSpy('onStateChanged');
            this.data.setValue = jasmine.createSpy('setData');
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _playerService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $scope = _$rootScope_.$new();
        appController = _$controller_('appController', { $scope: $scope, playerService: _playerService_ });
    }));

    describe("miscellaneous", function () {
        it("knows the current player", function() {
            expect($scope.currentPlayer).toBe(999);
        });

        it("knows the list of all players", function() {
            expect($scope.playerList.length).toBe(3);
        });
    });

    describe("controlDiceForPlayer", function() {
        var _diceQuantities = {
            999: new DiceQuantities(),
            555: new DiceQuantities()
        };

        _diceQuantities[999]["Green"] = 1;
        _diceQuantities[555]["Green"] = 2;

        beforeEach(function() {
            playerService.getDiceForPlayer = jasmine.createSpy('getDiceForPlayer').and.callFake(function (playerId) {
                return _diceQuantities[playerId];
            });
        });

        it("notifies the hangout when taking control of dice", function() {
            var playerId = 555;
            $scope.controlDiceForPlayer = playerId;
            $scope.$apply();
            expect(hangoutService.data.setValue).toHaveBeenCalledWith("controlDiceForPlayer-" + $scope.currentPlayer, playerId);
        });

        it("gets dice for controlled player", function() {
            var playerId = 555;
            $scope.controlDiceForPlayer = playerId;
            $scope.$apply();
            expect($scope.diceQuantities).toBe(_diceQuantities[playerId]);
        });

        it("notifies hangout of own dice when taking control of another user", function() {
            $scope.diceQuantities = _diceQuantities[_currentPlayer.id];
            playerService.setDiceForPlayer.calls.reset();
            var playerId = 555;
            $scope.controlDiceForPlayer = playerId;
            $scope.$apply();
            expect(playerService.setDiceForPlayer).toHaveBeenCalledWith(_currentPlayer.id, _diceQuantities[_currentPlayer.id]);
        });

    });
});
