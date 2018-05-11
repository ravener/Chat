const ws = new WebSocket("ws://localhost:3000/ws");


ws.onopen = function() {
  $("#status").html("Status: Connected");
  setInterval(() => {
    try {
      ws.send(JSON.stringify({ type: "HEARTBEAT" }));
    } catch(err) {
      console.error(err);
    }
  }, 25000);
}

function markdown(text) {
  if(text.startsWith("**") && text.endsWith("**")) return ("<b>" + escapeHtml(text) + "</b>").replace(new RegExp("\\*\\*", "g"), "");
  if(text.startsWith("~~") && text.endsWith("~~")) return ("<del>" + escapeHtml(text) + "</del>").replace(/~~/g, "");
  if(text.startsWith("__") && text.endsWith("__")) return ("<ins>" + escapeHtml(text) + "</ins>").replace(/__/g, "");
  if(text.startsWith("```") && text.endsWith("```")) return ("<pre><code>" + escapeHtml(text) + "</pre></code>").replace(/```/g, "");
  return escapeHtml(text);
}

ws.onmessage = function(event) {
  const d = JSON.parse(event.data);
  if(d && d.type === "MESSAGE_CREATE") {
    log(`<b>${d.data.author}</b> ${markdown(d.data.content)}`);
  }
  if(d && d.type === "HEARTBEAT_ACK") {
    console.log("[WEBSOCKET] Heartbeat Acknowledged");
  }
}

ws.onerror = function(err) {
  console.error(err);
  $("#status").html("Status: Error");
}

ws.onclose = function(ev) {
  $("#status").html("Status: Closed, Code: " + ev.code + " " + ev.reason);
}

function sendMessage(msg) {
  try {
    ws.send(JSON.stringify({
      type: "SEND_MESSAGE",
      data: {
        content: msg,
        author: $("#name").val() || "Unknown"
      }
    }));
  } catch(error) {
    console.error(error);
  }
}