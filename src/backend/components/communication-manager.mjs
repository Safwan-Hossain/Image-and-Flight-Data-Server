
import { SocketHandler } from "./socket-handler.mjs";
import { SerialPortHandler } from "./serial-port-handler.mjs"
import { Timer } from "./timer.js";
import { REQUEST_TYPES, TARGETS, ACTIONS, CommunicationData, UserCommData } from "../../shared-data/communication-data.js";
import { SERVER_EVENT_TAGS, CLIENT_EVENT_TAGS } from '../../shared-data/event-tags.js'
import { logger } from '../logger/logger.js';


export class CommunicationManager {
    constructor(server, customOptions = {}) {   
        this.socketHandler = new SocketHandler(server);
        this.serialHandler = new SerialPortHandler(customOptions);
        this.serialPortsTimer = new Timer(this.fetchAndReturnSerialPorts.bind(this), 1000);
        this.delay = 0;
    }

    startListening() {
        this.socketHandler.startListening();
    }

    registerEvents() {
        this.socketHandler.on('user_input_to_arduino', () => {}); // TODO

        // CAMERA EVENTS
        this.socketHandler.on(SERVER_EVENT_TAGS.CAMERA_IMAGE_DATA, (imageData) => {this.handleImageData(imageData)}) // Image data
        this.socketHandler.on(SERVER_EVENT_TAGS.CAMERA_SYSTEM_DATA, (cameraSystemData) => {this.handleCameraSystemData(cameraSystemData)}) // Additional Data from camera system (e.g. errors)

        // USER EVENTS
        this.socketHandler.on(SERVER_EVENT_TAGS.USER_INPUT, (userInput) => {this.handleUserInput(userInput)})
        this.socketHandler.on(SERVER_EVENT_TAGS.USER_SYSTEM_DATA, (userSystemData) => {this.handleUserSystemData(userSystemData)})

        // SERIAL EVENTS
        this.serialHandler.on(SERVER_EVENT_TAGS.SERIAL_DATA, (serialData) => this.handleSerialData(serialData));
    }

    handleImageData(imageData) {
        this.socketHandler.sendDataToClient(CLIENT_EVENT_TAGS.CAMERA_IMAGE_DATA, imageData);
    }


    handleUserInput(userInput) {       
        if (userInput.requestType === REQUEST_TYPES.DATA_REQUEST) {
            if (userInput.target === TARGETS.SERIAL) {
                if (userInput.action === ACTIONS.SERIAL.GET_PORT_LIST) {
                    this.fetchAndReturnSerialPorts();
                }
            }
        }
        else if (userInput.requestType === REQUEST_TYPES.CONFIG_UPDATE) {
            if (userInput.target === TARGETS.SERIAL) {
                switch (userInput.action) {
                    case ACTIONS.SERIAL.CONNECT:
                        this.tryConnectingToNewPort(userInput.value);
                        break;
                    case ACTIONS.SERIAL.DISCONNECT:
                        this.tryDisconnectingPort();
                        break;
                    case ACTIONS.SERIAL.RECONNECT:
                        // TODO
                        break;
                    default:
                        break;
                }
            }
        }
        else if (userInput.requestType === REQUEST_TYPES.DATA_UPDATE) {
            if (userInput.action === ACTIONS.GENERAL.TARGET_LOCK) {
                this.handleTargetLock(userInput.value)
            }
        }
    }


    handleTargetLock() {
        this.socketHandler.sendDataToCamera(CLIENT_EVENT_TAGS.USER_INPUT, userInput);
    }
    
    handleCameraSystemData(cameraSystemData) {
    
    }

    handleUserSystemData(userSystemData) {
        if (userSystemData.requestType === REQUEST_TYPES.DATA_UPDATE) {
            if (userSystemData.target === TARGETS.USER) {
                if (userSystemData.action === ACTIONS.GENERAL.NEW_CONNECTION) {
                    this.fetchAndReturnSerialPorts
                    this.serialPortsTimer.start();
                }
            }
        }

    }

    handleSerialData(serialData) {

        console.log(serialData);
        
        this.socketHandler.sendDataToClient(CLIENT_EVENT_TAGS.SERIAL_DATA, serialData);
        this.delay++;
        if (this.delay % 1000000 == 0) {
            this.socketHandler.sendDataToClient(CLIENT_EVENT_TAGS.SERIAL_DATA, serialData);
        }
    }

    tryConnectingToNewPort(newPort) {
        this.serialHandler.tryConnectingToPort(newPort)
    }

    tryDisconnectingPort() {
        this.serialHandler.tryDisconnectingFromCurrentPort()
        this.fetchAndReturnSerialPorts();
    }

    sendPortDataToClient(ports) {
        const portRequest = UserCommData.generatePortDataUpdate(ports);
        this.socketHandler.sendDataToClient(CLIENT_EVENT_TAGS.USER_SYSTEM_DATA, portRequest);
    }

    // rename to sendSerialPortDataToUser
    async fetchAndReturnSerialPorts() {
        try {
            const ports = await this.serialHandler.getListOfPorts();
            this.sendPortDataToClient(ports);
        } catch (error) {
            logger.error('Error getting list of ports:', error);
        }
    }
}