
const fs = require('fs')
const cors = require('cors')
const express = require('express')
// var privateKey = fs.readFileSync('192.168.43.119.key');
// var certificate = fs.readFileSync('192.168.43.119.cert');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
//{key:privateKey,cert:certificate},
var app = require('express')(),
    // server = require('https').createServer({key:privateKey,cert:certificate},app)
    server = require('https').createServer(app)
const wss = new WebSocketServer({ server: server });
require('dotenv').config()
app.use(cors())
app.use("/auth", require("./jwtAuth"))
app.use(express.json());

app.use('/uploads', express.static('./public/images'));


wss.on('connection', function(ws) {
    ws.room = []
        // ws.send(JSON.stringify({msg:"user joined"}));
        // console.log('User connected');
    ws.on('message', function(message) {
        // Broadcast any received message to all clients

        var message = JSON.parse(message);
        if (message.message) {
            message['time'] = new Date()
            console.log(message)
        }
        var roomName = message.roomName
        if (roomName) {
            if (!ws.room.includes(roomName)) {
                ws.room.push(roomName)
            }

        }
        console.log(ws.room)
        if (message.roomName) {
            if (message.close) {
                ws.close()
            }
            wss.broadcast(JSON.stringify(message));
        }
        // if(messag.msg){console.log('message: ',messag.msg)}
        // console.log(ws.room)
        console.log('received: %s', message);
        // wss.broadcast(message);
    });

    ws.on('error', () => ws.terminate());
});

wss.broadcast = function(data) {
    this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if (client.room.indexOf(JSON.parse(data).roomName) > -1) {
                client.send(data)

            }
        }
    });
};

setInterval(() => {
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN)
      {client.send(JSON.stringify(new Date().toTimeString()));}
    });
}, 1000);

app.start = app.listen = function() {
    console.log('server running on localhost || 192.168.43.119: '+process.env.PORT)
    return server.listen.apply(server, arguments)
}

app.start(process.env.PORT || 80)

app.get('/',(req,res)=>{
    res.send('backend working 👍')
})

// app.start(5000)