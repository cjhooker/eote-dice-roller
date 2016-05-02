(function () {
    var players = [{id: 1, name: "Han Solo"}, {id: 2, name: "Chewbacca"}, {id: 3, name: "Princess Leia"}];

    this.players = players;

    this.mockPlayerService = function($provide) {
        // Mock the player service so we can control what data we are expecting
        $provide.service('playerService', function() {
            playerService = this;
            this.getPlayer = jasmine.createSpy('getPlayer').and.callFake(function(playerId) {
                return players.filter(function(player) {return player.id == playerId})[0];
            });
        });
    }

    window.testDoubles = this;
})();
