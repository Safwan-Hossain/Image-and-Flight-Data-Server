class DroneState {

    // constructor(name, ip, threatLevel, location, velocity, acceleration, tilt, windSpeed, batteryPercentage) {
    //   this.name = name;
    //   this.ip = ip;
    //   this.threatLevel = threatLevel;
    //   this.location = this.formatArray(location);
    //   this.velocity = this.formatArray(velocity);
    //   this.acceleration = this.formatArray(acceleration);
    //   this.tilt = this.formatArray(tilt);
    //   this.windSpeed = this.formatArray(windSpeed);
    //   this.batteryPercentage = this.formatFloat(batteryPercentage);
    // }

    constructor() {
    }


    formatArray(array) {
      if (array == undefined || array.trim().length == 0 ) {
        return [];
      }
      return array.map(value => this.formatFloat(parseFloat(value)));
    }

    formatFloat(number) {
      return number.toFixed(1);
    }

    // ======= SETTERS =======
    
    setName(newName) {
      this.name = newName;
    }

    setIp(newIp) {
      this.ip = newIp;
    }

    setThreatLevel(newThreatLevel) {
      this.threatLevel = newThreatLevel;
    }

    setLocation(newLocation) {
      this.location = this.formatArray(newLocation);
    }

    setVelocity(newVelocity) {
      this.velocity = newVelocity;
    }

    setAcceleration(newAcceleration) {
      this.acceleration = newAcceleration;
    }

    setTilt(newTilt) {
      this.tilt = newTilt;
    }

    setWindSpeed(newWindSpeed) {
      this.windSpeed = newWindSpeed;
    }

    setBatteryPercentage(newBatteryPercentage) {
      this.batteryPercentage = newBatteryPercentage;
    }

}