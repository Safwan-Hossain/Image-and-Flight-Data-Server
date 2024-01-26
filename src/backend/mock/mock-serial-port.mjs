import { SerialPortMock } from 'serialport'



export class SerialPortMockHandler {

    constructor(options, dataGenerationInterval = 100) {
        this.path = SerialPortMockHandler.mockSerialPortData.path;
        this.options = options;
        this.interval = dataGenerationInterval; 
        this.dataEmitter = null;
        SerialPortMock.binding.createPort(this.path);
    }

    createSerialPortMock() {
        this.serialPort = new SerialPortMock({path: this.path, ...this.options});
        this.serialPort.on('open', () => this.emulateSerialData());
        return this.serialPort;
    }
    
    emulateSerialData() {
        this.dataEmitter = setInterval(() => {
            try {
                this.serialPort.port.emitData(this.generateMockData());
            } catch (error) {
                console.error('Error in mock data generation:', error);
            }
        }, this.interval);
    }

    stopEmulatingData() {
        if (this.dataEmitter) {
            clearInterval(this.dataEmitter);
        }
    }

    generateMockData() {
        return this.#generateRandomNumberBetween(1000, 2000) + "|" +
               this.#generateRandomNumberBetween(1000, 2000) + "|" +
               this.#generateRandomNumberBetween(1000, 2000) + "|" +
               this.#generateRandomNumberBetween(1000, 2000) + "," +
               this.#generateRandomNumberBetween(0, 360) + "|" +
               this.#generateRandomNumberBetween(0, 360) + "|" +
               this.#generateRandomNumberBetween(0, 360) + "," +
               this.#generateRandomNumberBetween(400, 601) 
               + "\r\n";
    }

    #generateRandomNumberBetween(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number' || a > b) {
            throw new Error('Invalid input parameters for random number generation');
        }
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    // Mock Serial Port Data
    static mockSerialPortData = {
        path: 'CUSTOM_MOCK_PORT',
        manufacturer: 'Mock Manufacturer',
        serialNumber: '1234567890',
        pnpId: 'MOCK_PNP_ID',
        locationId: 'Mock_Location_Id',
        friendlyName: 'Mock Serial Port',
        vendorId: '0000',
        productId: '0000'
    };
}
