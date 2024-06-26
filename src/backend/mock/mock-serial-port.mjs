import { SerialPortMock } from 'serialport'
import { DATA_GENERATION_INTERVAL, COMPONENT_VALUES } from './mock-config.js';
import { DATA_DELIMITER, ARRAY_DELIMITER, END_OF_LINE_DELIMITER, DEFAULT_PARSING_DATA } from '../../config/parsing-data.js';



export class SerialPortMockHandler {

    constructor(options, dataGenerationInterval = DATA_GENERATION_INTERVAL) {
        this.path = SerialPortMockHandler.mockSerialPortData.path;
        this.options = options;
        this.interval = dataGenerationInterval; 
        this.dataEmitter = null;
        this.previousValues = {}; 
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
        const itemIndexes = DEFAULT_PARSING_DATA.itemIndexes;

        let dataOrder = [];
        Object.keys(itemIndexes).forEach(index => {
            const componentTag = itemIndexes[index];
            dataOrder.push(this.generateComponentValues(componentTag));
        });

        return dataOrder.join(DATA_DELIMITER) + END_OF_LINE_DELIMITER;
    }

    generateComponentValues(componentTag) {
        const componentSettings = COMPONENT_VALUES[componentTag];
        const min = componentSettings.minValue;
        const max = componentSettings.maxValue;
        const numberOfValues = componentSettings.numberOfValues;

        if (!(componentTag in this.previousValues)) {
            this.previousValues[componentTag] = Array(numberOfValues).fill((min + max) / 2);
        }


        if (numberOfValues > 1) {
            return this.#generateGradualStringArray(componentTag, min, max, numberOfValues);
        }
        return this.#generateGradualNumberBetween(componentTag, min, max);
    }

    #generateGradualStringArray(componentTag, min, max, arraySize) {
        let finalString = "";
        for (let i = 0; i < arraySize; i++) {
            const isLastIndex = i == (arraySize - 1);
            const newValue = this.#generateGradualNumber(componentTag, i, min, max);
            
            finalString += newValue;
            if (!isLastIndex) {
                finalString += ARRAY_DELIMITER;
            }
        }
        return finalString;
    }

    #generateGradualNumber(componentTag, index, min, max) {
        const previousValue = this.previousValues[componentTag][index];
        const change = (Math.random() - 0.5) * 5; 
        let newValue = previousValue + change;
        newValue = Math.max(min, Math.min(newValue, max)); 

        this.previousValues[componentTag][index] = newValue; 
        return newValue.toFixed(2);
    }

    #generateGradualNumberBetween(componentTag, min, max) {
        const previousValue = this.previousValues[componentTag][0];
        const change = (Math.random() - 0.5) * 5; 
        let newValue = previousValue + change;
        newValue = Math.max(min, Math.min(newValue, max)); 

        this.previousValues[componentTag][0] = newValue; 
        return newValue.toFixed(2);
    }

    
    #generateRandomStringArray(min, max, arraySize) {
        let finalString = ""
        for (let i = 0; i < arraySize; i++) {
            const isLastIndex = i == (arraySize - 1);
            const randomNum = this.#generateRandomNumberBetween(min, max);
            
            finalString += randomNum;
            if (!isLastIndex) {
                finalString += ARRAY_DELIMITER;
            }
        }
        return finalString;
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
