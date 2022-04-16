const { Server } = require('socket.io');
const { createServer } = require("http");
const { spawn } = require('child_process');
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

const events = [
  {
    name: 'run',
    command: 'echo run && sleep 2 && echo runb && sleep 2 && echo runc && sleep 2 && echo rund'
  },
  {
    name: 'typecheck',
    command: 'echo typecheck && sleep 2 && echo typecheckb && sleep 2 && echo typecheckc && sleep 2 && echo typecheckd'
  },
  {
    name: 'annotate',
    command: 'echo annotate && sleep 2 && echo annotateb && sleep 2 && echo annotatec && sleep 2 && echo annotated'
  }
]

io.on('connection', socket => {
  console.log('connection!')

  events.forEach((ev) => {
    socket.on(ev.name, () => {
      socket.emit('lock')
      const command = spawn(ev.command, {
        shell: true
      });
      command.stdout.on('data', (data) => {
        io.emit('input', data.toString())
      })
      command.stdout.on('close', () => {
        socket.emit('unlock')
      })
    })
  })
});

io.listen(3001)