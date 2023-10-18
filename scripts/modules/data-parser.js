const NAME_INDEX = 0;
const IP_INDEX = 1;
const THREAT_INDEX = 2;
const LOCATION_INDEX = 3;
const VELOCITY_INDEX = 4;
const ACCELERATION_INDEX = 5;
const TILT_INDEX = 6;
const WIND_SPEED_INDEX = 7;
const BATTERY_INDEX = 8;
const VECTOR_DELIM  = '|';
const DATA_DELIM  = ',';

export class DataParser {
    static parseData(data) {
        const droneState = new DroneState();
        const parsedData = data.split(DATA_DELIM);
    
        const name = parsedData[NAME_INDEX];
        const ip = parsedData[IP_INDEX];
        const threatLevel = parsedData[THREAT_INDEX];
        const location = DataParser.parseVector(parsedData[LOCATION_INDEX]);
        const velocity = DataParser.parseVector(parsedData[VELOCITY_INDEX]);
        const acceleration = DataParser.parseVector(parsedData[ACCELERATION_INDEX]);
        const tilt = DataParser.parseVector(parsedData[TILT_INDEX]);
        const windSpeed = DataParser.parseVector(parsedData[WIND_SPEED_INDEX]);
        const batteryPercentage = parsedData[BATTERY_INDEX];
    
        droneState.setName(name);
        droneState.setIp(ip);
        droneState.setThreatLevel(threatLevel);
        droneState.setLocation(location);
        droneState.setVelocity(velocity);
        droneState.setAcceleration(acceleration);
        droneState.setTilt(tilt);
        droneState.setWindSpeed(windSpeed);
        droneState.setBatteryPercentage(batteryPercentage);
    
        return droneState;
    } 

    static parseVector(vector) {
        if (vector == undefined) {
            return "";
        }
        return vector.substring(1, vector.length - 1).split(VECTOR_DELIM);
    }
}