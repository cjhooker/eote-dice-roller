describe("filters", function () {
    beforeEach(module("appModule"));

    var $filter;

    beforeEach(module(testDoubles.mockPlayerService));

    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
    }));

    describe("participantArrayToString", function () {
        var filter;

        beforeEach(function() {
            filter = $filter('participantArrayToString');
        });

        it("shows a full list", function () {
            expect(filter([1, 2, 3], true)).toBe("Han Solo, Chewbacca, Princess Leia");
        });

        it("shows nobody", function () {
            expect(filter([], false)).toBe("nobody");
        });

        it("shows name for one person", function () {
            expect(filter([3], false)).toBe("Princess Leia");
        });

        it("shows 2 people", function () {
            expect(filter([2, 3], false)).toBe("2 people");
        });
    });
});
