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
  // Manipulador para receber mensagens do cliente
  socket.on("chat message", (message) => {
    // Enviar mensagem para todos os clientes conectados
    io.emit("chat message", message);
  });

  // Manipulador para quando o cliente se desconectar
});

// Iniciar o servidor
const port = 3000;
http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
