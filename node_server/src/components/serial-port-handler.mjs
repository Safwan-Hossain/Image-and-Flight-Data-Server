import { EventEmitter } from 'events';
import { SerialPort, ReadlineParser } from 'serialport';
import { Config } from '../server-config.js';

const ARDUINO_PORT = Config.server.arduinoPort;
const DATA_EVENT_TAG = "data";

const DEFAULT_OPTIONS = {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}

export class SerialPortHandler extends EventEmitter {
    constructor(customOptions = {}) {
        super()
        // custom options will override matching default options
        this.options = { ...DEFAULT_OPTIONS, ...customOptions };
        this.serialPort = null;
    }

    async getListOfPorts() {
        try {
            const ports = await SerialPort.list();
            ports.forEach(port => {
                port.isAlreadyConnected = (this.serialPort?.settings.path === port.path);
            });
            return ports;
        } catch (error) {
            console.error("Error listing ports: ", error);
            throw error;
        }
    }


    tryConnectingToPort(path = ARDUINO_PORT) {
        tryDisconnectingFromCurrentPort();
        this.serialPort = new SerialPort({path: path, ...this.options});
        const parser = this.attachParserToSerial();
        
        parser.on(DATA_EVENT_TAG, (dataFromArduino) => this.emit(DATA_EVENT_TAG, dataFromArduino));
        
        this.serialPort.on('error', (error) => {
            // Add error handling 
            console.error("Serial Port Error: ", error);
        });
        
        this.serialPort.on('open', () => this.onSerialPortOpened());
        this.serialPort.on('close', () => this.onSerialPortClosed());
    };

    tryDisconnectingFromCurrentPort() {
        if (this.isPortConnected) {
            this.serialPort.close((error) => {
                if (error) {
                    console.error("Error closing the port: ", error);
                    return false;
                } else {
                    return true;
                }
            });
        }
    }

    isPortConnected() {
        return this.serialPort && this.serialPort.isOpen;
    }

    onSerialPortOpened() {
        const path = this.serialPort.settings.path
        console.log(`Connected to Serial Port: ${path}`);
    }

    onSerialPortClosed() {
        const path = this.serialPort.settings.path
        this.serialPort = null;
        console.log(`Disconnected from Serial Port: ${path}`);
    }

    attachParserToSerial() {
        const parser = new ReadlineParser({ delimiter: '\r\n' })
        return this.serialPort.pipe(parser);
    }
}

