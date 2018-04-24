var socket = io();

function chatKeyDown() {
	if (event.keyCode == 13) {
		sendChat();
	}
}

function changeName() {
	var name = document.getElementById("uName").value;
	if(name.length < 1 || name.length > 16) {
		console.log("Name too short or too long");
		return;
	}
	socket.emit("change_name", name);
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
	var chatDiv = document.getElementById('chatDiv');
	console.log("[received]: " + data);
	chatDiv.innerHTML += data + "<br>";
	if(document.getElementById("aScroll").checked) {
		chatDiv.scrollTop = chatDiv.scrollHeight;
	}
});

socket.on("chat_data", function(data) {
	var chatDiv = document.getElementById('chatDiv');
	while(data.length > 0) {
		chatDiv.innerHTML += data.shift() + "<br>";
	}
	chatDiv.scrollTop = chatDiv.scrollHeight;
});