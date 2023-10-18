import { DataParser } from './modules/data-parser.js';
import { updateClient as updateWebpage } from './modules/value-updater.js';
import { Config } from '../node_server/server-config.js';

const SERVER_PORT = Config.server.serverPort;
const socket = io('http://localhost:' + SERVER_PORT);

socket.on('arduinoData', (data) => {
    const droneState = DataParser.parseData(data);
    updateWebpage(droneState);
});

socket.on('frame2', (data) => {
    console.log("Received on client");
    const imageUrl = 'data:image/jpeg;base64,' + data;
    document.getElementById('video-stream').src = imageUrl;
});




