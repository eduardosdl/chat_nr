const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Conexão de cliente Socket.io
io.on("connection", (socket) => {
  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
});

// Iniciar o servidor
const port = 3000;
http.listen(port, () => {
  console.log(`Server running`);
});
