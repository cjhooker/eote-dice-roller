// Note that these are really integration tests, because they're testing the underlying gapi.hangouts fake as well
// as the playerService.
describe("playerService", function() {

    beforeEach(module("appModule"));

    it("gets the player list", inject(function(playerService) {
        var playerList = playerService.getPlayerList();
        expect(playerList.length).toBe(3);
        expect(playerList.filter(function(player) { return player.name == 'Chris Hooker'; }).length).toBe(1);
        expect(playerList.filter(function(player) { return player.name == 'Han Solo'; }).length).toBe(1);
        expect(playerList.filter(function(player) { return player.name == 'Princess Leia'; }).length).toBe(1);
    }));

    it("gets the current player", inject(function(playerService) {
        var player = playerService.getCurrentPlayer();
        expect(player.name).toBe("Chris Hooker");
    }));

    it("gets a player by id", inject(function(playerService) {
        var player = playerService.getPlayer(1);
        expect(player.name).toBe("Han Solo");
    }));

    it("gets empty dice list if player has none stored", inject(function(playerService) {
        var playerId = 2;
        var diceQuantities = playerService.getDiceForPlayer(playerId);
        Object.getOwnPropertyNames(diceQuantities).forEach(function(val, idx, array) {
            expect(diceQuantities[val]).toBe(0);
        });
    }));

    it("sets and gets dice list for player", inject(function(playerService) {
        var playerId = 2;
        // Start by getting an empty list
        var diceQuantities = playerService.getDiceForPlayer(playerId);
        diceQuantities["Green"] = 1;
        diceQuantities["Red"] = 2;

        playerService.setDiceForPlayer(playerId, diceQuantities);

        var newDiceQuantities = playerService.getDiceForPlayer(playerId);

        expect(newDiceQuantities["Green"]).toBe(1);
        expect(newDiceQuantities["Red"]).toBe(2);
    }));

});
