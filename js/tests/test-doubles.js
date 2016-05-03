(function () {
    var players = [{id: 1, name: "Han Solo"}, {id: 2, name: "Chewbacca"}, {id: 3, name: "Princess Leia"}];
    var currentPlayer = players[0];

    this.currentPlayer = currentPlayer;
    this.players = players;

    this.mockPlayerService = function($provide) {
        // Mock the player service so we can control what data we are expecting
        mockPlayerService($provide, "playerService", 0);
    }

    this.mockPlayerServiceA = function($provide) {
        // Mock the player service so we can control what data we are expecting
        mockPlayerService($provide, "playerServiceA", 0);
    }

    this.mockPlayerServiceB = function($provide) {
        // Mock the player service so we can control what data we are expecting
        mockPlayerService($provide, "playerServiceB", 1);
    }

    this.mockHangoutService = function($provide) {
        // Mock the hangout service so that event handlers don't get set up globally on gapi.hangout
        $provide.service('hangoutService', function() {
            hangoutService = this;
            this.onEnabledParticipantsChanged = jasmine.createSpy('onEnabledParticipantsChanged');
            this.data = {}
            this.data.onStateChanged = jasmine.createSpy('onStateChanged');
            this.data.setValue = jasmine.createSpy('setData');
        });
    }

    function mockPlayerService($provide, serviceName, currentPlayerIndex) {
        $provide.service(serviceName, function() {
            this.getPlayer = jasmine.createSpy('getPlayer').and.callFake(function(playerId) {
                return players.filter(function(player) {return player.id == playerId})[0];
            });
            this.getCurrentPlayer = jasmine.createSpy('getCurrentPlayer').and.callFake(function() {
                return players[currentPlayerIndex];
            });
            this.getPlayerList = jasmine.createSpy('getPlayerList').and.callFake(function() {
                return players;
            });
            this.setDiceForPlayer = jasmine.createSpy('setDiceForPlayer').and.callFake(function (playerId, diceQuantities) {
                return;
            });
        });
    }

    window.testDoubles = this;
})();
