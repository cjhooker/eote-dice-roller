//var baseUrl = "https://eote-hangouts-dice-roller.googlecode.com/git/";
var baseUrl = "";

var dice = {
	"Green": ["S", "S", "SS", "A", "A", "SA", "AA", ""],
	"Yellow": ["S", "S", "SS", "SS", "A", "SA", "SA", "SA", "AA", "AA", "X", ""],
	"Purple": ["F", "FF", "T", "T", "T", "TT", "FT", ""],
	"Red": ["F", "F", "FF", "FF", "T", "T", "FT", "FT", "TT", "TT", "D", ""],
	"Boost": ["S", "SA", "AA", "A", "", ""],
	"Setback": ["F", "F", "T", "T", "", ""],
    "Force": ["B", "B", "B", "B", "B", "B", "BB", "W", "W", "W", "WW", "WW"]
	};
	
var symbols = {
	"S": "success.png",
	"F": "failure.png",
	"A": "advantage.png",
	"T": "threat.png",
	"X": "triumph.png",
	"D": "despair.png",
	"B": "black-circle.png",
    "W": "white-circle.png"
}