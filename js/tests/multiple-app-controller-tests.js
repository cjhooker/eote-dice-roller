// describe("interactions between multiple appControllers", function () {
//
//     beforeEach(module("appModule"));
//
//     var appControllerA,
//         appControllerB,
//         playerServiceA,
//         playerServiceB,
//         $scopeA,
//         $scopeB;
//
//     beforeEach(module(testDoubles.mockPlayerServiceA));
//     beforeEach(module(testDoubles.mockPlayerServiceB));
//     beforeEach(module(testDoubles.mockHangoutService));
//
//     beforeEach(inject(function(_$rootScope_, _$controller_, _playerServiceA_, _playerServiceB_) {
//         // The injector unwraps the underscores (_) from around the parameter names when matching
//         $scopeA = _$rootScope_.$new();
//         $scopeB = _$rootScope_.$new();
//         appControllerA = _$controller_('appController', { $scope: $scopeA, playerService: _playerServiceA_ });
//         appControllerB = _$controller_('appController', { $scope: $scopeB, playerService: _playerServiceB_ });
//         playerServiceA = _playerServiceA_;
//         playerServiceB = _playerServiceB_;
//     }));
//
//     it("both know their current player", function() {
//         expect($scopeA.currentPlayer).toBe(testDoubles.players[0].id);
//         expect($scopeB.currentPlayer).toBe(testDoubles.players[1].id);
//     });
//
//     it("both know the list of all players", function() {
//         expect($scopeA.playerList.length).toBe(3);
//         expect($scopeB.playerList.length).toBe(3);
//     });
//
// });
