import express from "express";
import http from 'http';
import { Config } from './server-config.js'
import { SocketHandler } from "./components/socket-handler.mjs";
import { SerialPortHandler } from "./components/serial-port-handler.mjs";
import { SerialSocketBridge } from "./components/serial-socket-bridge.mjs";

const SERVER_PORT = Config.server.serverPort;
const ARDUINO_PORT = Config.server.arduinoPort; 
const MESSAGE_BEGIN_FLAG = Config.parser.messageBeginFlag; 
const MESSAGE_END_FLAG = Config.parser.messageEndFlag; 

const app = express();
const server = http.createServer(app);
server.listen(SERVER_PORT, () => {
    console.log(`Server started on port ${SERVER_PORT}`);
});  

const socketHandler = new SocketHandler(server);
const serialPortHandler = new SerialPortHandler();
const serialSocketBridge = new SerialSocketBridge(serialPortHandler, socketHandler);

serialSocketBridge.registerEvents();
socketHandler.startListening();


// serialPortHandler.on('data', socketHandler.sendDroneDataToClient);

// socketHandler.displaySettingsToClient();

// socketHandler.on('setting', tryConnectingToPort);

// let tryingToConnectToArduino = false;
// function tryConnectingToPort(port) {
//     if (tryingToConnectToArduino) {
//         return;
//     }

//     tryingToConnectToArduino = true;
//     serialPortHandler.tryConnectingToPort(port)
//     if (failed) {
//         displayErrorToClient();
//     }
//     tryingToConnectToArduino = false;
// }
