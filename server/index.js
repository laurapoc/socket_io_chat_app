const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`USER CONNECTED with id: ${socket.id}`);

  // create an event which determined if someone wants to join teh room:
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    //emit message only to a specific room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// connect to front-end
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
