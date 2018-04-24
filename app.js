var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

var port = process.env.PORT || 80;
if(process.env.PORT == undefined) {
	console.log("no port defined using default (80)");
}

serv.listen(port);
var io = require("socket.io")(serv, {});

console.log("Socket started on port " + port);

var SOCKET_LIST = {};
var MESSAGES = [];

function disconnectSocket(id) {
	SOCKET_LIST[id].disconnect();
	delete SOCKET_LIST[id];
}

io.sockets.on("connection", function(socket) {
	socket.id = Math.round(Math.random() * 1000);
	socket.uName = "Unnamed";
	SOCKET_LIST[socket.id] = socket;
	
	socket.emit("chat_data", MESSAGES);

	socket.on("disconnect", function() {
		try {
			disconnectSocket(socket.id);
		} catch(err) {}
	});

	socket.on('change_name', function(data){
		try {
			if(data.length < 1 || data.length > 16) {
				return;
			}
			socket.uName = data;
			console.log("User with id " + socket.id + " changed name to " + socket.uName);
		} catch(err) {}
	});

	socket.on('send_chat', function(data){
		try {
			data = "[" + socket.uName + "]: " + data;
			console.log("<Chat>: " + data + " | by user with id " + socket.id);
			MESSAGES.push(data);
			for(var s in SOCKET_LIST) {
				SOCKET_LIST[s].emit("chat", data);
			}
		} catch(err) {}
	});
});
console.log("[Warning] Don't use this as a real chat. It is vulnerable to xss attacks and should only be used to learn how to perform or protect against xss attacks");
console.log("Server started");