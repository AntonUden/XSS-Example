var socket = io();

function chatKeyDown() {
	if (event.keyCode == 13) {
		sendChat();
	}
}

function sendChat() {
	var text = document.getElementById("chat_input").value;
	document.getElementById("chat_input").value = "";
	if(text.length < 1) {
		console.log("Ignoring empty message");
		return;
	}
	console.log("[Send]: " + text);
	socket.emit("send_chat", text);
}

socket.on("chat", function(data) {
	console.log("[received]: " + data);
	document.getElementById("chatDiv").innerHTML += data + "<br>";
});

socket.on("chat_data", function(data) {
	while(data.length > 0) {
		document.getElementById("chatDiv").innerHTML += data.shift() + "<br>";
	}
});