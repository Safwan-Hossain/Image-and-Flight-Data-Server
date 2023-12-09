import { Config } from '../server-config.js'

export class ArduinoDataProcessor {
    constructor(socketHandler, config = Config.parser) {
        this.socketHandler = socketHandler;
        this.config = config;
        this.dataFromArduino = "";
    }

    formatAndSendDataToClient(rawData) {
        try {
            let processedData = rawData.toString();
            if (!this.config.useMessageMarkingFlags) {
                this.sendMessageToClient(processedData);
                return;
            }
            
            if (this.isEndOfMessage(processedData)) {
                this.endMessage(processedData);
                this.sendMessageToClient();
                this.flushMessage();
            }
            else if (this.isStartOfMessage(processedData)) {
                this.flushMessage();
                this.beginMessage(processedData);
            }
            else {
                this.appendMessage(processedData);
            }
        } catch (error) {
            console.error("Error processing data: ", error);
            // Handle error todo
        }
    }
    
    appendMessage(stringData) {
        this.dataFromArduino += stringData;
    }

    endMessage(stringData) {
        this.dataFromArduino += stringData.replace(this.config.messageEndFlag, "");
        this.dataFromArduino = this.dataFromArduino.trim();
        this.dataFromArduino =  this.sanitizeData(this.dataFromArduino);
    }

    sendMessageToClient(data = this.dataFromArduino) {
        this.socketHandler.sendDroneDataToClient(data);
    }

    flushMessage() {
        this.dataFromArduino = "";
    }

    beginMessage(stringData) {
        this.dataFromArduino += this.sanitizeData(stringData.replace(this.config.messageBeginFlag, ""));
    }

    isStartOfMessage(stringData) {
        return stringData.includes(this.config.messageBeginFlag);
    }

    isEndOfMessage(stringData) {
        return stringData.includes(this.config.messageEndFlag);
    }

    sanitizeData(data) {
        return data.replace(/[\r\n]/g, "");
    }
}
