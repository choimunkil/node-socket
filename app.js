const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

// chat namespace 사용
const chat = io.of("/chat");

chat.on("connection", (socket) => {
  console.log("chat namespace connected");

  const roomIdx = socket.handshake.query.roomIdx;
  socket.join(roomIdx);
  socket.to(roomIdx).emit("join", roomIdx + " chatroom join");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(roomIdx);
  });

  socket.on("send", (msg) => {
    socket.emit("receive", msg);
    socket.to(roomIdx).emit("receive", msg);
  });
});

// Vercel은 module.exports를 통해 앱을 내보냄
module.exports = app;
