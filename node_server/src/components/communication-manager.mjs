
import { SocketHandler } from "./socket-handler.mjs";
import { SerialPortHandler } from "./serial-port-handler.mjs"

// Events that are sent to the server
const SERVER_EVENT_TAGS = {
    CAMERA_IMAGE_DATA: 'camera_image_data_to_server',
    CAMERA_SYSTEM_DATA: 'camera_system_data_to_server',
    USER_INPUT: 'user_input_to_server',
    USER_SYSTEM_DATA: 'user_system_data_to_server',
    SERIAL_DATA: 'serial_data_to_server',
}

// Events that are broadcasted from the server to a client (client/camera/serial)
const CLIENT_EVENT_TAGS = {
    CAMERA_IMAGE_DATA: 'camera_image_data_to_client',
    CAMERA_SYSTEM_DATA: 'camera_system_data_to_client',
    USER_INPUT: 'user_input_to_client',
    USER_SYSTEM_DATA: 'user_system_data_to_client',
    SERIAL_DATA: 'serial_data_to_client',
}

export class CommunicationManager {
    constructor(server, customOptions = {}) {   
        this.socketHandler = new SocketHandler(server);
        this.serialHandler = new SerialPortHandler(customOptions);
    }

    startListening() {
        // Get port data from serial and display to user once user is connected
    }

    registerEvents() {
        this.serialHandler.on('data', (dataFromArduino) => this.socketHandler.sendDroneDataToClient(dataFromArduino)); // drone data from serial is forwarded
        this.socketHandler.on('user_input_to_arduino', () => {}); // TODO
        this.socketHandler.on('port-list', (data) => { this.fetchAndReturnSerialPorts() }) // user requests port list
        this.socketHandler.on('new_arduino_port', (port) => { this.serialHandler.tryConnectingToPort(port) }) // user requests port connection
        this.socketHandler.on('disconnect_serial_port', () => this.tryDisconnectingPort()) // user requests current port to be disconnected

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
        this.socketHandler.sendDataToCamera(CLIENT_EVENT_TAGS.USER_INPUT, userInput);
    }

    
    handleCameraSystemData(cameraSystemData) {
        // cameraSystemData.type: connection
        // cameraSystemData.subtype: null
        // cameraSystemData.error-type: disconnected unexpectedly
        // cameraSystemData.error-message: null
        // cameraSystemData.action: reconnecting

        
        // cameraSystemData.type: connection
        // cameraSystemData.subtype: disconnected succesfully
        // cameraSystemData.error-type: null
        // cameraSystemData.error-message: null
        // cameraSystemData.action: reconnecting
    }

    handleUserSystemData(userSystemData) {

    }

    handleSerialData(serialData) {
        // this.socketHandler.sendDroneDataToClient(serialData)
        this.socketHandler.sendDataToClient(CLIENT_EVENT_TAGS.SERIAL_DATA, serialData);
    }


    tryDisconnectingPort() {
        this.serialHandler.tryDisconnectingFromCurrentPort()
        this.fetchAndReturnSerialPorts();
    }

    async fetchAndReturnSerialPorts() {
        try {
            const ports = await this.serialHandler.getListOfPorts();
            this.socketHandler.sendPortDataToClient(ports);
        } catch (error) {
            console.error('Error getting list of ports:', error);
        }
    }
}