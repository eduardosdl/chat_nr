// Importar as configurações do servidor
const app = require('../config/server');
const prettier = require('prettier');

const PORT = process.env.PORT || 3000;

// Parametrizar a porta de escuta
const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

// var io = new skt.server(server);
const serveIo = require('socket.io');
const io = new serveIo.Server(server);

app.set('io', io);

// criar a conexão do websocket
io.on('connection', function (socket) {
  console.log('Usuário conectou');

  socket.on('disconnect', function () {
    console.log('Usuário desconectou');
  });

  socket.on('msgParaServidor', function (data) {
    const [prefixo, ...mensagem] = data.mensagem.split(' ');

    // dialogo
    if (prefixo === '/code') {
      // caso exista o prefixo '/code' ira enviar apenas o codigo sem o preixo para o front
      // prettier para formartar o codigo da maneira certa
      let codigo = '';

      try {
        codigo = prettier.format(mensagem.join(' '), {
          parser: 'babel',
          semi: true,
          singleQuote: true,
          tabWidth: 2,
        });
      } catch (error) {
        console.log(error);
        codigo = mensagem.join(' ');
      }

      socket.emit('msgParaCliente', { apelido: data.apelido, codigo });

      socket.broadcast.emit('msgParaCliente', {
        apelido: data.apelido,
        codigo,
      });
    } else {
      // caso nao exista o prefixo enviara a mensagem normalmente
      socket.emit('msgParaCliente', {
        apelido: data.apelido,
        mensagem: data.mensagem,
      });

      socket.broadcast.emit('msgParaCliente', {
        apelido: data.apelido,
        mensagem: data.mensagem,
      });
    }

    // participantes
    if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
      socket.emit('participantesParaCliente', { apelido: data.apelido });

      socket.broadcast.emit('participantesParaCliente', {
        apelido: data.apelido,
      });
    }
  });
});
