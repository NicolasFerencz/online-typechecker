const { Server } = require('socket.io');
const { createServer } = require("http");
const { spawn } = require('child_process');
const httpServer = createServer();
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
var path = require('path');
const local_dir = './resources/temp'
dotenv.config();

spawn(
  `cd ${process.env.ELIXIR_DIR} && 
  poetry run gradualelixir configure --working-dir ${path.resolve(__dirname)}/resources/temp`, 
  { shell: true }
);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

const removeANSIColors = (str) => {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

const events = [
  {
    name: 'typecheck static',
    command: (filename) => `cd ${process.env.ELIXIR_DIR} && poetry run gradualelixir type_check --static ${filename}`
  },
  {
    name: 'typecheck',
    command: (filename) => `cd ${process.env.ELIXIR_DIR} && poetry run gradualelixir type_check ${filename}`
  },
  {
    name: 'annotate types',
    command: (filename) => `cd ${process.env.ELIXIR_DIR} && poetry run gradualelixir type_check --annotate types ${filename}`,
    fileSubfix: '_types.ex'
  },
  {
    name: 'annotate casts',
    command: (filename) => `cd ${process.env.ELIXIR_DIR} && poetry run gradualelixir type_check --annotate casts ${filename}`,
    fileSubfix: '_casts.ex'
  }
]

io.on('connection', socket => {
  events.forEach((ev) => {
    try {  
      socket.on(ev.name, (arg) => {
        socket.emit('lock')
        const uuid = uuidv4()
        const filename = `${uuid}.ex`
        const path = `${local_dir}/${filename}`
        fs.writeFileSync(path, arg, () => {})
        const command = spawn(ev.command(filename), { shell: true });
        command.stderr.on('data', (data) => {
          socket.emit('input', {
            code: removeANSIColors(data.toString()),
            isElixir: false
          })
        })
        command.stdout.on('data', (data) => {
          if(!fs.existsSync(`${local_dir}/${uuid}${ev.fileSubfix}`)) {
            socket.emit('input', {
              code: removeANSIColors(data.toString()),
              isElixir: false
            })
          }
        })
        command.stdout.on('close', () => {
          fs.unlink(path, () => {})
          if(ev.fileSubfix) {
            const auxFile = `${local_dir}/${uuid}${ev.fileSubfix}`
            if (fs.existsSync(auxFile)) {
              const content = fs.readFileSync(auxFile, {encoding:'utf8', flag:'r'});
              socket.emit('input', {
                code: content,
                isElixir: true
              })
              fs.unlink(auxFile, () => {})
            }
          }
          socket.emit('unlock')
        })
      })
    }
    catch (err) {
      io.emit('input', err)
      socket.emit('unlock')
    }
  })
});

io.on('disconnect', () => {
  console.log('bye')
})

io.listen(3001)
