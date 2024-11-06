const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("send-location",(data)=>{
        io.emit("received-location",{id:socket.id,...data});
    })
    socket.on("disconnect",()=>{
    io.emit("user-disconnected",socket.id)
    })
});


app.get("/", (req, res) => {
    res.render("index");
});

// Use server.listen here instead of app.listen
server.listen(3000, () => {
    console.log("Listening to port 3000");
});
