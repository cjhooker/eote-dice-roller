describe("appController", function() {

    beforeEach(module("appModule"));

    var appController,
        playerService,
        $scope;

    beforeEach(module(testDoubles.mockPlayerService));
    beforeEach(module(testDoubles.mockHangoutService));

    beforeEach(inject(function(_$rootScope_, _$controller_, _playerService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $scope = _$rootScope_.$new();
        appController = _$controller_('appController', { $scope: $scope, playerService: _playerService_ });
        playerService = _playerService_;
    }));

    describe("miscellaneous", function () {
        it("knows the current player", function() {
            expect($scope.currentPlayer).toBe(testDoubles.currentPlayer.id);
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
            $scope.diceQuantities = _diceQuantities[testDoubles.currentPlayer.id];
            playerService.setDiceForPlayer.calls.reset();
            var playerId = 555;
            $scope.controlDiceForPlayer = playerId;
            $scope.$apply();
            expect(playerService.setDiceForPlayer).toHaveBeenCalledWith(testDoubles.currentPlayer.id, _diceQuantities[testDoubles.currentPlayer.id]);
        });

    });
});
