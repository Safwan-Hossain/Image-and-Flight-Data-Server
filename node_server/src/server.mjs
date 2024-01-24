





// =========================================== IMPORTANT =========================================== //
// THIS IS AN OLD CLASS AND IS ONLY KEPT FOR REFERENCE. THE NEWER VERSION FOR THIS CLASS IS MAIN.MJS //
// =========================================== ========= =========================================== //



// import * as socketIo from 'socket.io';
import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import { SerialPort }  from 'serialport';
import { Config } from './server-config.js'

const SERVER_PORT = Config.server.serverPort;
const ARDUINO_PORT = Config.server.arduinoPort; 
const MESSAGE_BEGIN_FLAG = Config.parser.messageBeginFlag; 
const MESSAGE_END_FLAG = Config.parser.messageEndFlag; 


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});


console.log('Attempting to connect to port number:', ARDUINO_PORT);

SerialPort.list().then(ports => {
  console.log(ports)
}).catch(err => {
  console.log('Error listing ports:', err); // Catch and log any error that occurs during the listing.
});



const serialPort = new SerialPort({
    path: ARDUINO_PORT,
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
  });



let dataFromArduino = "";


serialPort.on('data', (rawData) => {
  // console.log("RAW DATA: " + rawData);
  formatAndSendDataToClient(rawData);
});

// app.use(express.static('public'));

server.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});

// ======= OPEN CV PYTHON ==========
io.on('connection', (socket) => {
  console.log('User connected');

  // Event for receiving frames from Python script
  socket.on('video', (data) => {
      // Extract the image from the data
      
      console.log(data.image.toString().trim().substring(-1, -10));
      const image = data.image;
      
      // Broadcast the frame to all other connected clients
      socket.broadcast.emit('frame2', image);
  });

  socket.on('target_data', (data) => {
    console.log("TARGET AQUIRED: " + data);
    socket.broadcast.emit('user_input', data);
  });
});
// ======= OPEN CV PYTHON ==========

function formatAndSendDataToClient(rawData) {
    // io.emit('arduinoData', rawData.toString());
    console.log(rawData.toString());
    let stringData = rawData.toString();
    if (isEndOfMessage(stringData)) {
      endMessage(stringData);
      sendMessageToClient();
      flushMessage();
    }
    else if (isStartOfMessage(stringData)) {
      flushMessage();
      beginMessage(stringData);
    }
    else {
      appendMessage(stringData);
    }
}

function appendMessage(stringData) {
  dataFromArduino += stringData;
}

function endMessage(stringData) {
  dataFromArduino += stringData.replace(MESSAGE_END_FLAG, "");
  dataFromArduino = dataFromArduino.replace("\n", "");
  dataFromArduino = dataFromArduino.replace("\r", "");
  dataFromArduino = dataFromArduino.trim();
}

function sendMessageToClient() {
  io.emit('arduinoData', dataFromArduino);
  // console.log("SENT DATA: " + dataFromArduino);
}

function flushMessage() {
  dataFromArduino = "";
}

function beginMessage(stringData) {
  dataFromArduino += stringData.replace(MESSAGE_BEGIN_FLAG, "");
}

function isStartOfMessage(stringData) {
  return stringData.includes(MESSAGE_BEGIN_FLAG);
}

function isEndOfMessage(stringData) {
  return stringData.includes(MESSAGE_END_FLAG);
}