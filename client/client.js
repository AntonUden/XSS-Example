var socket = io();

function chatKeyDown(event) {
	var kc = event.which || event.keyCode;
	if (kc == 13) {
		sendChat();
	}
}

function changeName() {
	var name = document.getElementById("uName").value;
	if(name.length < 1 || name.length > 16) {
		console.log("Name too short or too long");
		return;
	}
	setCookie("chatUserName", name, 60);
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
	console.log("[received]: " + data);
	$("#chatDiv").append(data + "<br>");
	if(document.getElementById("aScroll").checked) {
		var chatDiv = document.getElementById('chatDiv');
		chatDiv.scrollTop = chatDiv.scrollHeight;
	}
});

socket.on("chat_data", function(data) {
	while(data.length > 0) {
		$("#chatDiv").append(data.shift() + "<br>");
	}
	var chatDiv = document.getElementById('chatDiv');
	chatDiv.scrollTop = chatDiv.scrollHeight;
});

try {
	if(getCookie("chatUserName") != "") {
		if(getCookie("chatUserName").length > 16) {
			console.error("[Warning] Name stored in cookie is too long. resetting to Unnamed");
			setCookie("chatUserName", "Unnamed", 360);
		}
		document.getElementById("uName").value = getCookie("chatUserName");
		changeName();
	} else {
		setCookie("chatUserName", "Unnamed", 360);
	}
} catch(err) {}