// var http = require('http');
// var fs = require('fs');
// var index = fs.readFileSync( 'index.html');
// const { ReadlineParser } = require("@serialport/parser-readline");


// var SerialPort = require('serialport').SerialPort;
// // const parsers = SerialPort.parsers;

// // const parser = new parsers.Readline({
// //     delimiter: '\r\n'
// // });


// var port = new SerialPort({ 
//     path:"COM3",
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });

// const parser = new ReadlineParser({ delimeter: "\r\n" });
// port.pipe(parser);

// var app = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(index);
// });

// var io = require('socket.io')(app);

// io.on('connection', function(socket) {
    
//     console.log('Node is listening to port');
    
// });

// parser.on('data', function(data) {
    
//     console.log('Received data from port: ' + data);
    
//     io.emit('data', data);
    
// });

// app.listen(3000);

//=================


// import * as socketIo from 'socket.io';
import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import { SerialPort }  from 'serialport';
import { Config } from './server-config.js'
import cors from 'cors';

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

const serialPort = new SerialPort({
    path:ARDUINO_PORT,
    baudRate: 2400,
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

app.use(express.static('public'));

server.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});

// ======= OPEN CV PYTHON ==========
io.on('connection', (socket) => {
  console.log('User connected');

  // Event for receiving frames from Python script
  socket.on('video', (data) => {
      // Extract the image from the data
      const image = data.image;
      
      // Broadcast the frame to all other connected clients
      socket.broadcast.emit('frame2', image);
  });
});
// ======= OPEN CV PYTHON ==========

function formatAndSendDataToClient(rawData) {
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