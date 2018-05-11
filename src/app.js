const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const http = require("http");
const helmet = require("helmet");

const app = express();

app.set("port", process.env.port || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(helmet());

const urlencodedParser = express.urlencoded({ extended: true });
const jsonParser = express.json();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/chat", (req, res) => {
  const ua = req.get("User-Agent");
  if(ua.indexOf("Android") !== -1) res.render("index.ejs");
  else res.render("index-pc.ejs"); // a bigger site for pc
  // no iPhone version kthxbai.
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: "/ws" });

function broadcast(message) {
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) client.send(message);
  });
}

wss.on("listening", () => {
  console.log("WebSocket Server ready!");
});

wss.on("error", (err) => {
  console.error("[WEBSOCKET] " + err);
});

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("error", (error) => {
    console.log("[CLIENT WEBSOCKET] " + error);
  });
  
  ws.on("message", (msg) => {
    try { JSON.parse(msg); } catch(err) { return ws.close(1009, "INVALID PAYLOAD"); }
    const json = JSON.parse(msg);
    if(!json.type) return ws.close(1008, "No Type");
    if(json.type === "SEND_MESSAGE") {
      if(!json.data || !json.data.content || !json.data.author) return ws.close(1009, "INVALID PAYLOAD");
      if(json.content && json.content.length > 500) return ws.close(1008, "MESSAGE TOO LONG"); 
      if(typeof json.data.content.toString === "function") json.data.content = json.data.content.toString();
      const resp = {
        type: "MESSAGE_CREATE",
        data: {
          content: json.data.content,
          author: json.data.author
        }
      }
      broadcast(JSON.stringify(resp));
    } else if(json.type === "HEARTBEAT") {
      ws.isAlive = true;
      ws.send(JSON.stringify({ type: "HEARTBEAT_ACK" }), (err) => { });
    }
    else {
      ws.close(1007, "INVALID TYPE");
    }
  }); 
});

const interval = setInterval(() => {
  wss.clients.forEach(x => {
    if(x.isAlive === false) return x.terminate();
    x.isAlive = false;
  })
}, 30000);

server.listen(app.get("port"), () => {
  console.log("App listening to port %d", app.get("port"));
});