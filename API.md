# CHAT API
You may use our API if you feel like it, we use websocket connection for this.

## Connecting
The URL is always `ws://freetnt.glitch.me` once connected
you may send a message with json it must have `type` property always to say what this message is. use the events props below some may not be allowed to sent as some are for recieving.

## Heartbeat
Clients must send a heartbeat every 30 seconds if not the connction will be terminated. heartbeat are sent with type property set to `HEARTBEAT`, example heartbeat
```json
{
  "type": "HEARTBEAT"
}
```
In return the server must respond with a heartbeat ack to acknowledge the heartbeat you may use this to find broken connections and reconnect.

## Events

### SEND_MESSAGE
sent by client to send a message. the json props are `data` that will have more json inside it which is content and author. example send message
```json
{
  "type": "SEND_MESSAGE",
  "data": {
    "content": "Hello, World!",
    "author": "Some Person"
  }
}
```
All properties from the example are __required__ a missing property will lead to a disconnect. to prevent abuse we limit the message to 500 characters if you exceed this limit you will be disconnected.

### HEARTBEAT
sent by client to ping the server and keep connection alive, must be sent every 30 seconds, you may use a few early seconds just incase to be sent on time, 25 seconds is most often recommended. example heartbeat
```json
{
  "type": "HEARTBEAT"
}
```

### HEARTBEAT_ACK
Sent by server in response to heartbeat to notify the client that the server is responding often its good idea to reconnect if this did not arrive in like 5 seconds. example heartbeat ack
```json
{
  "type": "HEARTBEAT_ACK"
}
```

## MESSAGE_CREATE
Sent when a message is sent to the server this is triggered everytime a user sends message. example message create
```json
{
  "type": "MESSAGE_CREATE",
  "data": {
    "content": "The message content",
    "author": "Person who sent the message"
  }
}
```
All properties are guranteed to be available as we do not accept missing properties when sending messsage and will disconnect if a property sent was missing.

**Now take this and make great things happen**
**Got ideas for our API? let us know at discord message me at Free TNT#5796**