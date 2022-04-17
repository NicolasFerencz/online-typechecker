const { Server } = require('socket.io');
const { createServer } = require("http");
const { spawn } = require('child_process');
const httpServer = createServer();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const local_dir = './resources/temp'

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

const events = [
  {
    name: 'run',
    command: (filename) => 'echo run && sleep 2 && echo runb && sleep 2 && echo runc && sleep 2 && echo rund'
  },
  {
    name: 'typecheck',
    command: (filename) => `cd ${process.env.ELIXIR_DIR} && poetry run gradualelixir type_check --static ${filename}`
  },
  {
    name: 'annotate',
    command: (filename) => 'echo annotate && sleep 2 && echo annotateb && sleep 2 && echo annotatec && sleep 2 && echo annotated'
  }
]

io.on('connection', socket => {
  events.forEach((ev) => {
    socket.on(ev.name, (arg) => {
      socket.emit('lock')
      const uuid = uuidv4()
      const filename = `${ev.name}-${uuid}.ex`
      const path = `${local_dir}/${filename}`
      fs.writeFileSync(path, arg, () => {})
      const command = spawn(ev.command(filename), { shell: true });
      command.stderr.on('data', (data) => {
        io.emit('input', data.toString())
      })
      command.stdout.on('data', (data) => {
        io.emit('input', data.toString())
      })
      command.stdout.on('close', () => {
        fs.unlink(path, () => {})
        socket.emit('unlock')
      })
    })
  })
});

io.on('disconnect', () => {
  console.log('bye')
})

io.listen(3001)