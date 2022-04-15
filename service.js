const { Server } = require('socket.io');
const { createServer } = require("http");
const { spawn } = require('child_process');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true
  }
});

io.on('connection', socket => {
  const ls = spawn('echo a && sleep 7 && echo b && sleep 7 && echo c && sleep 7 && echo d', {
    shell: true
  });
  ls.stdout.on('data', (data) => {
    io.emit('input', data.toString())
  })
  console.log(`connect ${socket.id}`);

  socket.on('disconnect', reason => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });

  socket.on('howdy', (arg) => {
    console.log(arg)
  })
});

io.listen(3000)