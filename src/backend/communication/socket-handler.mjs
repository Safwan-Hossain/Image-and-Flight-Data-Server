import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import { logger } from '../misc/logger.js';
import { UserCommData } from '../../common/communication-data.js';
import { SERVER_EVENT_TAGS } from '../../common/event-tags.js'
import { CLIENT_ROLES } from '../../common/roles.js'


const SOCKET_CONNECTION_EVENT_TAG = "connection";


// Camera system and user client will connect to this server socket. 
// The socket acts as a middleman between the camera system and user.
// The camera system will send image data to the socket, which will then be forwarded to the user
// The user can also send input data (e.g. target lock) to the socket, which will be forwarded to the camera
export class SocketHandler  extends EventEmitter {
    constructor(server) {        
        super();
        this.io = new Server(server, {
            cors: {
                origin: '*', // Note for future - Allowing for cross origin may be security issue
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
                case CLIENT_ROLES.CAMERA:
                    this.registerCamera(socket);
                    break;
                case CLIENT_ROLES.USER:
                    this.registerClient(socket);
                    break;
                default:
                    logger.warn(`Unknown role connected: ${role}. Disconnecting.`);
                    socket.disconnect();
            }
        });
    }

    sendDroneDataToClient(droneData) {
        const ArduinoTag = 'arduinoData';
        this.sendDataToClient(ArduinoTag, droneData)
    }
    
    sendDataToClient(eventTag, data) {
        if (!this.isClientStillConnected()) {
            logger.warn(`Client not connected, cant send data for event ${eventTag}`);
            return;
        }
        this.clientSocket.emit(eventTag, data)
    }
    
    sendDataToCamera(eventTag, data) {
        if (!this.isCameraStillConnected()) {
            logger.warn(`Camera not connected, cant send data for event ${eventTag}`);
            return;
        }
        this.cameraSocket.emit(eventTag, data)
    }

    registerCamera(socket) {
        logger.info('Camera connected!');
        this.cameraSocket = socket;        
        this.cameraSocket.on(SERVER_EVENT_TAGS.CAMERA_IMAGE_DATA, (imageData) => this.emit(SERVER_EVENT_TAGS.CAMERA_IMAGE_DATA, imageData));
        this.cameraSocket.on(SERVER_EVENT_TAGS.CAMERA_SYSTEM_DATA, (systemData) => this.emit(SERVER_EVENT_TAGS.CAMERA_SYSTEM_DATA, systemData));
    }
    
    registerClient(socket) {
        logger.info('User connected!');
        this.clientSocket = socket;
        this.clientSocket.on(SERVER_EVENT_TAGS.USER_INPUT, (userInput) => {this.emit(SERVER_EVENT_TAGS.USER_INPUT, userInput)});
        this.clientSocket.on(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, (systemData) => this.emit(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, systemData));
        this.notifyNewUserConnected(this.clientSocket);
    }

    notifyNewUserConnected(userSocket) {
        this.emit(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, UserCommData.generateNewConnectionUpdate(userSocket.id))
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
