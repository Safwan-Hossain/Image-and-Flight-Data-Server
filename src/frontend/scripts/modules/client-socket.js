import { Config } from '../../../shared-data/server-config.js';
import { DataParser } from './data-parser.js';
import { UserCommData } from '../../../shared-data/communication-data.js'
import { SERVER_EVENT_TAGS, CLIENT_EVENT_TAGS } from '../../../shared-data/event-tags.js';
import { CLIENT_ROLES } from '../../../shared-data/roles.js';
import { tempUpdateView } from './visual.js'


const SERVER_PORT = Config.server.serverPort;

const SETTING_EVENT_TAG = 'setting';
const PORT_LIST_EVENT_TAG = 'port-list';
const INFORMATION_REQUEST_EVENT_TAG = 'information_request';

const SETTING_ACTIONS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect'
}

const SETTING_TYPES = {
    SERIAL_CONNECTION: "serial_connection",
}

// These are in-built event tags from socket.io
const DEFAULT_SOCKET_TAGS = {
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error',
    ERROR: 'error'
}


export class ClientSocket {
    constructor() {

    }
   
    tryConnectingToServer() {
        const tempSocket = io('http://localhost:' + SERVER_PORT, { query: { role: CLIENT_ROLES.USER }});

        tempSocket.on(DEFAULT_SOCKET_TAGS.CONNECT, () => {
            console.log('Successfully connected to the server.');
            this.socket = tempSocket;
            this.registerEvents()
        });

        tempSocket.on(DEFAULT_SOCKET_TAGS.CONNECT_ERROR, (error) => {
            console.error('Failed to connect to server:', error);
        });

        tempSocket.on(DEFAULT_SOCKET_TAGS.ERROR, (error) => {
            console.error('Socket error:', error);
        });
    }

    registerEvents() {
        
        this.socket.on(CLIENT_EVENT_TAGS.SERIAL_DATA, (data) => {
            const droneState = DataParser.parseData(data);
            // console.log(droneState);
            tempUpdateView(data);
        });

        this.socket.on('frame2', (data) => {
            console.log("Image data received on javascript");
            const videoStream = document.getElementById('video-stream');
            const videoPlaceholder = document.getElementById('video-placeholder');
          
            if (data) {
                const imageUrl = 'data:image/jpeg;base64,' + data;
                videoStream.src = imageUrl;
                videoStream.style.display = 'block';
                videoPlaceholder.style.display = 'none';
            } else {
                videoStream.style.display = 'none';
                videoPlaceholder.style.display = 'flex';
            }
        });
        
        this.socket.on(CLIENT_EVENT_TAGS.USER_SYSTEM_DATA, (data) => {
            this.onReceiveSerialPortList(data.value);
        });
    }

    sendUserInput(input) {
        this.socket.emit(SERVER_EVENT_TAGS.USER_INPUT, input);
    }

    sendSystemData(systemData) {
        this.socket.emit(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, systemData);
    }
    
    getSerialPortData() {
        const request = UserCommData.generateGetPortDataRequest();
        // console.log(request);
        this.socket.emit(INFORMATION_REQUEST_EVENT_TAG, PORT_LIST_EVENT_TAG);
    }

    sendNewArduinoPathToServer(value) {        
        const setting = { type: SETTING_TYPES.SERIAL_CONNECTION, action: SETTING_ACTIONS.CONNECT, value: value };
        this.sendDataToServer(SETTING_EVENT_TAG, setting);
    }


    disconnectCurrentSerialPort() {
        const setting =  {type: SETTING_TYPES.SERIAL_CONNECTION , action: SETTING_ACTIONS.DISCONNECT, value: null };
        this.sendDataToServer(SETTING_EVENT_TAG, setting);
    }
        
    sendDataToServer(eventTag, data) {
        this.socket.emit(eventTag, data);
    }

    onReceiveSerialPortList(serialPorts) {
        const selectElement = document.getElementById('option-select');

        this.removeNonExistingPorts(selectElement, serialPorts);
        this.addNewPorts(selectElement, serialPorts);
    }

    removeNonExistingPorts(selectElement, serialPorts) {
        const existingPortPaths = new Set(serialPorts.map(serialPort => serialPort.path));
        const selectedPath = selectElement.value; // Get the currently selected option's value
    
        Array.from(selectElement.options).forEach(option => {
            // Check if the option's path is not in the serialPorts list and it's not the selected option
            if (!existingPortPaths.has(option.dataset.path) && option.value !== selectedPath && option.value != 'default') {
                selectElement.removeChild(option);
            }
        });
    }

    addNewPorts(selectElement, serialPorts) {
        const existingPortPaths = new Set(Array.from(selectElement.options).map(option => option.dataset.path));
        serialPorts.forEach(serialPort => {
            if (!existingPortPaths.has(serialPort.path)) {
                let option = document.createElement('option');
                option.value = serialPort.path;
                option.textContent = serialPort.friendlyName;
                option.dataset.path = serialPort.path;
                selectElement.appendChild(option);
                
                if (serialPort.isAlreadyConnected === true) {
                    option.selected = true; 
                    option.style.backgroundColor = 'yellow'; 
                    
                    // TEMP
                    document.getElementById('dropdown-container').style.display = 'none';
                    const mainContent = document.getElementsByClassName('grid-container')[0];
                    mainContent.style.display = 'grid';
                    // TEMP
                }
            }
            
        });
    }
    
}