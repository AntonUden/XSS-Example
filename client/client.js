var socket = io();

function chatKeyDown(event) {
	let kc = event.which || event.keyCode;
	if (kc == 13) {
		sendChat();
	}
}

function changeName() {
	let name = $("#uName").val();
	if(name.length < 1 || name.length > 16) {
		console.log("Name too short or too long");
		return;
	}
	setCookie("chatUserName", name, 60);
	socket.emit("change_name", name);
}

function sendChat() {
	let text = $("#chat_input").val();
	$("#chat_input").val("");
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
	if($("#aScroll").prop('checked')) {
		let chatDiv = document.getElementById('chatDiv');
		$("#chatDiv").scrollTop($("#chatDiv").prop('scrollHeight'));
	}
});

socket.on("chat_data", function(data) {
	while(data.length > 0) {
		$("#chatDiv").append(data.shift() + "<br>");
	}
	if($("#aScroll").prop('checked')) {
		$("#chatDiv").scrollTop($("#chatDiv").prop('scrollHeight'));
	}
});

$("#setName").click(function() {
	changeName();
});

try {
	if(getCookie("chatUserName") != "") {
		if(getCookie("chatUserName").length > 16) {
			console.error("[Warning] Name stored in cookie is too long. resetting to Unnamed");
			setCookie("chatUserName", "Unnamed", 360);
		}
		$("#uName").val(getCookie("chatUserName"));
		changeName();
	} else {
		setCookie("chatUserName", "Unnamed", 360);
	}
} catch(err) {}