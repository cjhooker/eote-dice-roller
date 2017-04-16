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

io.on("connection", function(socket){
    console.log("a participant connected");
    // Send new participants the current destiny pool
    socket.emit("destiny", destiny);
    console.log("sending destiny " + destiny)

    socket.on("disconnect", function(){
        console.log("user disconnected");
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
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});

function createMessage (type, data) {
    var message = {
        type: type,
        participantId: 1234,
        data: data
    };

    return message;
}
