var baseUrl = "https://eote-hangouts-dice-roller.googlecode.com/git";

var dice = {
	"Green": ["S", "S", "SS", "A", "A", "SA", "AA", ""],
	"Yellow": ["S", "S", "SS", "SS", "A", "SA", "SA", "SA", "AA", "AA", "*", ""],
	"Purple": ["F", "FF", "T", "T", "T", "TT", "FT", ""],
	"Red": ["F", "F", "FF", "FF", "T", "T", "FT", "FT", "TT", "TT", "X", ""],
	"Boost": ["S", "SA", "AA", "A", "", ""],
	"Setback": ["F", "F", "T", "T", "", ""]
	};
	
var symbols = {
	"S": "success.png",
	"F": "failure.png",
	"A": "advantage.png",
	"T": "threat.png",
	"*": "triumph.png",
	"X": "despair.png",
}