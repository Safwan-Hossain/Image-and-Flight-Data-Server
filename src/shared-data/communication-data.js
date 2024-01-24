export class CommunicationData {
    constructor(requestType) {
        this.requestType = requestType
    }

    toString() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds(); 
        const request = JSON.stringify(this);
        return `[${hours}:${minutes}:${seconds}] ${request}`;
    }

}

export class UserCommData extends CommunicationData {
    constructor(requestType) {
        super(requestType); 
    }

    setRequestType(requestType) {
        this.requestType = requestType
    }
    setTarget(target) {
        this.target = target
    }
    setAction(action) {
        this.action = action
    }
    setValue(value) {
        this.value = value
    }



    static generateNewConnectionUpdate(userId) {
        const request = new UserCommData(REQUEST_TYPES.DATA_UPDATE);
        request.setTarget(TARGETS.USER);
        request.setAction(ACTIONS.GENERAL.NEW_CONNECTION);
        request.setValue(userId);

        return request;
    }

    static generatePortDataUpdate(ports) {
        const request = new UserCommData(REQUEST_TYPES.DATA_UPDATE);
        request.setTarget(TARGETS.USER);
        request.setAction(ACTIONS.USER.SEND_PORT_LIST);
        request.setValue(ports);
        
        return request;
    }

    static generateGetPortDataRequest() {
        const request = new UserCommData(REQUEST_TYPES.DATA_REQUEST);
        request.setTarget(TARGETS.SERIAL);
        request.setAction(ACTIONS.SERIAL.GET_PORT_LIST);
        return request;
    }

    static generateSerialConnectRequest(newSerialPath) {
        const request = new UserCommData(REQUEST_TYPES.CONFIG_UPDATE);
        request.setTarget(TARGETS.SERIAL);
        request.setAction(ACTIONS.SERIAL.CONNECT)
        request.setValue(newSerialPath);
        return request;

    }
    static generateSerialReconnectRequest() {
        const request = new UserCommData(REQUEST_TYPES.CONFIG_UPDATE);
        request.setTarget(TARGETS.SERIAL);
        request.setAction(ACTIONS.SERIAL.RECONNECT)
        return request;
    }
    static generateSerialDisconnectRequest() {
        const request = new UserCommData(REQUEST_TYPES.CONFIG_UPDATE);
        request.setTarget(TARGETS.SERIAL);
        request.setAction(ACTIONS.SERIAL.DISCONNECT)
        return request;
    }

    toString() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds(); 
        const request = JSON.stringify(this);
        return `[${hours}:${minutes}:${seconds}] ${request}`;
    }
}

export class CameraCommData extends CommunicationData {
    constructor(type) {
        super(type); 
    }


}

export const TARGETS = {
    SERIAL: 'serial_port',
    CAMERA: 'camera',
    USER: 'user'
};

export const ACTIONS = {
    GENERAL: {
        TARGET_LOCK: "target_lock",
        NEW_CONNECTION: "new_connection"
    },
    USER: {
        SEND_IMAGE_DATA: 'send_image_data',
        SEND_PORT_LIST: 'send_port_list'
    },
    SERIAL: {
        CONNECT: 'connect',
        RECONNECT: 'reconnect',
        DISCONNECT: 'disconnect',
        GET_PORT_LIST: 'get_port_list'
    },
    CAMERA: {
        CONFIG_CHANGE: 'config_change'
    }
};

export const REQUEST_TYPES = {
    CONFIG_UPDATE: 'config_update',
    DATA_REQUEST: 'data_request',
    DATA_UPDATE: 'data_update'
};