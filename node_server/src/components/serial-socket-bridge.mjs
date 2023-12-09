
export class SerialSocketBridge {
    constructor(serialHandler, socketHandler) {   
        this.serialHandler = serialHandler;
        this.socketHandler = socketHandler;
    }

    registerEvents() {
        this.serialHandler.on('data', (dataFromArduino) => this.socketHandler.sendDroneDataToClient(dataFromArduino));
        this.socketHandler.on('user_input_to_arduino', () => {}); // TODO
        this.socketHandler.on('port-list', (data) => { this.fetchAndReturnSerialPorts() })
        this.socketHandler.on('new_arduino_port', (port) => { this.serialHandler.tryConnectingToPort(port) })
        this.socketHandler.on('disconnect_serial_port', () => this.tryDisconnectingPort())
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