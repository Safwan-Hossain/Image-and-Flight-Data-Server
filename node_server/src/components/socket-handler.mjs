import { EventEmitter } from 'events';
import { Server } from 'socket.io';

const SOCKET_CONNECTION_EVENT_TAG = "connection";

// INCOMING EVENTS
const VIDEO_EVENT_TAG = 'video';
const CLIENT_INPUT_EVENT_TAG = 'target_data';
const PORT_LIST_EVENT_TAG = 'port-list';
const INFORMATION_REQUEST_EVENT_TAG = 'information_request';
const SETTING_EVENT_TAG = 'setting';
const NEW_SERIAL_PORT_EVENT_TAG = 'new_arduino_port';
const DISCONNECT_PORT_EVENT_TAG = 'disconnect_serial_port';

// OUTGOING (BROADCASTED) EVENTS
const CLIENT_IMAGE_BROADCAST_EVENT_TAG = "frame2";
const CAMERA_INPUT_BROADCAST_EVENT_TAG = "user_input";

// ROLES
const CAMERA_ROLE_TAG = "camera";
const CLIENT_ROLE_TAG = "client";


// Events that are sent to the server
const SERVER_EVENT_TAGS = {
    CAMERA_IMAGE_DATA: 'camera_image_data_to_server',
    CAMERA_SYSTEM_DATA: 'camera_system_data_to_server',
    USER_INPUT: 'user_input_to_server',
    USER_SYSTEM_DATA: 'user_system_data_to_server',
    SERIAL_DATA: 'serial_data_to_server',
}

// SETTINGS

const SETTING_ACTIONS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect'
}

const SETTING_TYPES = {
    SERIAL_CONNECTION: "serial_connection",
}

// Camera system and user client will connect to this server socket. 
// The socket acts as a middleman between the camera system and user.
// The camera system will send image data to the socket, which will then be forwarded to the user
// The user can also send input data (e.g. target lock) to the socket, which will be forwarded to the camera
export class SocketHandler  extends EventEmitter {
    constructor(server) {        
        super();
        this.io = new Server(server, {
            cors: {
                origin: '*', // Note - Allowing for cross origin may be security issue
                methods: ['GET', 'POST']
            }
        });
        this.clientSocket = null;
        this.cameraSocket = null;
    }

    startListening() {
        this.io.on(SOCKET_CONNECTION_EVENT_TAG, (socket) => {
            const role = socket.handshake.query.role;
            switch (role) {
                case CAMERA_ROLE_TAG:
                    this.registerCamera(socket);
                    break;
                case CLIENT_ROLE_TAG:
                    this.registerClient(socket);
                    break;
                default:
                    console.warn(`Unknown role connected: ${role}. Disconnecting.`);
                    socket.disconnect();
            }
        });
    }

    sendPortDataToClient(portData) {
        this.sendDataToClient(PORT_LIST_EVENT_TAG, portData)
    }

    sendDroneDataToClient(droneData) {
        const ArduinoTag = 'arduinoData';
        this.sendDataToClient(ArduinoTag, droneData)
    }
    
    sendDataToClient(eventTag, data) {
        if (!this.isClientStillConnected()) {
            console.warn(`Client not connected, cant send data for event ${eventTag}`);
            return;
        }
        this.clientSocket.emit(eventTag, data)
    }
    
    sendDataToCamera(eventTag, data) {
        if (!this.isCameraStillConnected()) {
            console.warn(`Camera not connected, cant send data for event ${eventTag}`);
            return;
        }
        this.cameraSocket.emit(eventTag, data)
    }

    registerCamera(socket) {
        console.log('Camera connected!');
        this.cameraSocket = socket;
        this.cameraSocket.on(VIDEO_EVENT_TAG, (data) => this.onImageDataReceived(data));

        
        this.cameraSocket.on(SERVER_EVENT_TAGS.CAMERA_IMAGE_DATA, (imageData) => this.emit(SERVER_EVENT_TAGS.CAMERA_IMAGE_DATA, imageData));
        this.cameraSocket.on(SERVER_EVENT_TAGS.CAMERA_SYSTEM_DATA, (systemData) => this.emit(SERVER_EVENT_TAGS.CAMERA_SYSTEM_DATA, systemData));
    }
    
    registerClient(socket) {
        console.log('Client connected!');
        this.clientSocket = socket;
        this.clientSocket.on(CLIENT_INPUT_EVENT_TAG, (data) => this.onClientInputReceived(data));
        this.clientSocket.on(INFORMATION_REQUEST_EVENT_TAG, (data) => this.onClientRequestReceived(data));
        this.clientSocket.on(SETTING_EVENT_TAG, (data) => this.onClientSettingReceived(data));
        
        this.clientSocket.on(SERVER_EVENT_TAGS.USER_INPUT, (userInput) => this.emit(SERVER_EVENT_TAGS.USER_INPUT, userInput));
        this.clientSocket.on(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, (systemData) => this.emit(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, systemData));
        this.emit(PORT_LIST_EVENT_TAG, '')
    }
    
    // Handle video event
    onImageDataReceived(data) {
        const image = data.image;
        this.clientSocket.emit(CLIENT_IMAGE_BROADCAST_EVENT_TAG, image)
    }

    // Handle client input event
    onClientInputReceived(data) {
        console.log('TARGET ACQUIRED: ' + data);
        this.cameraSocket.emit(CAMERA_INPUT_BROADCAST_EVENT_TAG, data)
    }

    
    onClientSettingReceived(newSetting) {
        if (newSetting.type == SETTING_TYPES.SERIAL_CONNECTION) {
            if (newSetting.action === SETTING_ACTIONS.CONNECT) {
                this.emit(NEW_SERIAL_PORT_EVENT_TAG, newSetting.value);
            }
            else if (newSetting.action === SETTING_ACTIONS.DISCONNECT) {
                this.emit(DISCONNECT_PORT_EVENT_TAG, newSetting.value);
            }
        }
    }

    onClientRequestReceived(request) {
        if (request == PORT_LIST_EVENT_TAG) {
            this.emit(PORT_LIST_EVENT_TAG, '')
        }
    }

    getIO() {
        return this.io;
    }
    
    isClientStillConnected() {
        return this.isSocketConnected(this.clientSocket);
    }

    isCameraStillConnected() {
        return this.isSocketConnected(this.cameraSocket);
    }

    isSocketConnected(socket) {
        return socket && socket.connected
    }
}
