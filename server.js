var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/app.html');
});

app.use(express.static('client'))

http.listen(3000, function(){
  console.log('listening on *:3000');
});
