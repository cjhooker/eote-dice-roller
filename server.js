var utilities = require('./utilities');

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/client/app.html");
});

app.use(express.static("client"))

var destiny = "";
var participants = [];
var currentParticipantId = 1;
var testParticipants = [
    {
        imageUrl: "/images/test-images/han-solo.jpg",
        displayName: "Han Solo"
    },
    {
        imageUrl: "/images/test-images/princess-leia.jpg",
        displayName: "Princess Leia"
    }
];

function getNextParticipant(socketId) {
    var participantId = currentParticipantId++;
    var testParticipant = testParticipants[participantId % 2];
    return { participantId, socketId, imageUrl: testParticipant.imageUrl, displayName: testParticipant.displayName };
}

io.on("connection", function(socket){

    var participant = getNextParticipant(socket.id);
    participants.push(participant);
    io.emit("participants", participants);
    socket.emit("join", participant.participantId);
    socket.emit("destiny", destiny);
    console.log(`A participant connected ${JSON.stringify(participant)}`);

    socket.on("disconnect", function(){
        var disconnectedParticipant = participants.filter(p => p.socketId === socket.id)[0];
        var index = participants.indexOf(disconnectedParticipant);
        participants.splice(index, 1);
        io.emit("participants", participants);
        console.log(`A participant disconnected ${JSON.stringify(participant)}`);
    });

    socket.on("destiny-add", function(){
        destiny += "L";
        console.log("Destiny added. Current destiny: " + destiny);
        io.emit("destiny", destiny);
        io.emit("message", createMessage("html", { html: "Destiny added" }));
    });

    socket.on("destiny-remove", function(){
        destiny = destiny.substr(0, destiny.length - 1);
        console.log("Destiny removed. Current destiny: " + destiny);
        io.emit("destiny", destiny);
        io.emit("message", createMessage("html", { html: "Destiny removed" }));
    });

    socket.on("destiny-toggle", function(position){
        var destinyUsed = destiny.charAt(position);
        if (destinyUsed == "L") {
            destiny = utilities.replaceAt(destiny, position, "D");
        } else {
            destiny = utilities.replaceAt(destiny, position, "L");
        }
        console.log("Destiny used: " + destinyUsed + ". Current destiny: " + destiny);
        io.emit("destiny", destiny);
        io.emit("message", createMessage("html", { html: "Destiny used: " + (destinyUsed == "L" ? "Light" : "Dark") }));
    });

    socket.on("message", function(message){
        console.log(message);
        io.emit("message", message);
    });

    function createMessage (type, data) {
        var message = {
            participantId: participants.filter(p => p.socketId === socket.id)[0].participantId,
            type: type,
            data: data
        };

        return message;
    }
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});
