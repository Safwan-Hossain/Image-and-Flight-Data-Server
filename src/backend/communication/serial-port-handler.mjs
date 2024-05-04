import { EventEmitter } from 'events';
import { SerialPort, ReadlineParser } from 'serialport';
import { Config } from '../../config/server-config.js';
import { SerialPortMockHandler } from '../mock/mock-serial-port.mjs';
import { SERVER_EVENT_TAGS } from '../../common/event-tags.js'
import { logger } from '../misc/logger.js';


const ARDUINO_PORT = Config.server.arduinoPort;
const MOCK_SERIAL_PATH = SerialPortMockHandler.mockSerialPortData.path;

// These are in-built event tags from SerialPort
const DEFAULT_SERIAL_TAGS = {
    DATA: 'data',
    OPEN: 'open',
    CLOSE: 'close',
    ERROR: 'error'
}

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
        this.serialPortMockHandler = new SerialPortMockHandler(this.options);
        this.serialPort = null;
    }

    async getListOfPorts() {
        const ports = await SerialPort.list();
        ports.push(SerialPortMockHandler.mockSerialPortData);
        ports.forEach(port => {
            port.isAlreadyConnected = (this.serialPort?.settings.path === port.path);
        });
        return ports;
    }


    tryConnectingToPort(path = ARDUINO_PORT) {
        this.tryDisconnectingFromCurrentPort();
        if (path === MOCK_SERIAL_PATH) {
            this.serialPort = this.serialPortMockHandler.createSerialPortMock();
        } 
        else {
            this.serialPort = new SerialPort({path: path, ...this.options});
        }
        
        const parser = this.attachParserToSerial();
        parser.on(DEFAULT_SERIAL_TAGS.DATA, (dataFromArduino) => this.emit(SERVER_EVENT_TAGS.SERIAL_DATA, dataFromArduino));
        
        this.serialPort.on(DEFAULT_SERIAL_TAGS.ERROR, (error) => {
            // Add error handling 
            logger.error("Serial Port Error: ", error);
        });
        
        this.serialPort.on(DEFAULT_SERIAL_TAGS.OPEN, () => this.onSerialPortOpened());
        this.serialPort.on(DEFAULT_SERIAL_TAGS.CLOSE, () => this.onSerialPortClosed());
    };

    tryDisconnectingFromCurrentPort() {
        if (this.isPortConnected()) {
            this.serialPort.close((error) => {
                if (error) {
                    logger.error("Failed to close serial port: ", error);
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
        logger.info(`Connected to Serial Port: ${path}`);
    }

    onSerialPortClosed() {
        const path = this.serialPort.settings.path
        this.serialPort = null;
        logger.info(`Disconnected from Serial Port: ${path}`);
    }

    attachParserToSerial() {
        const parser = new ReadlineParser({ delimiter: '\r\n' })
        return this.serialPort.pipe(parser);
    }
}

