const CSS_ANIMATION_END_EVENT_TAG = 'animationend';
const CSS_PULSE_DURATION_VAR = '--lightning-animation-duration';

export class BatteryGraph {
    constructor(battery, batteryPercentage, lightningSymbol, chargeRateDisplay) {
      this.chargeLevel = 50;
      this.maxChargeLevel = 100;
      this.minChargeLevel = 0;
      this.chargeThreshold = 500;
      this.chargeSpeed = 0.05;
      this.dischargeSpeed = 0.05;
      this.latestChargeRate = this.chargeThreshold;
      this.lastUpdateTimestamp = null;
  
      this.battery = battery;
      this.batteryPercentage = batteryPercentage;
      this.lightningSymbol = lightningSymbol;
      this.chargeRateDisplay = chargeRateDisplay;
  
      this.lightningSymbol.addEventListener(CSS_ANIMATION_END_EVENT_TAG, () => this.handleAnimationEnd());
      this.startAnimation();
    }
  
    updateChargeRate(newRate) {
      this.latestChargeRate = newRate;
    }
  
    startAnimation() {
      requestAnimationFrame((timestamp) => this.animateChargeLevel(timestamp));
    }
  
    animateChargeLevel(timestamp) {
      if (this.lastUpdateTimestamp === null) {
        this.lastUpdateTimestamp = timestamp;
      }
      const elapsed = timestamp - this.lastUpdateTimestamp;
      const chargeRate = this.latestChargeRate;
  
      if (chargeRate > this.chargeThreshold) {
        this.increaseCharge(chargeRate, elapsed);
      } 
      else {
        this.decreaseCharge(elapsed);
      }
  
      this.updateDisplay();
      this.lastUpdateTimestamp = timestamp;
      requestAnimationFrame((timestamp) => this.animateChargeLevel(timestamp));
    }
    
    increaseCharge(chargeRate, elapsed) {
      const rateMultiplier = (chargeRate - this.chargeThreshold) / (1023 - this.chargeThreshold);
      this.chargeLevel += rateMultiplier * this.chargeSpeed * elapsed;
      this.chargeLevel = Math.min(this.chargeLevel, this.maxChargeLevel);
      this.lightningSymbol.style.display = 'block';
    }
    
    decreaseCharge(elapsed) {
      this.chargeLevel -= this.dischargeSpeed * elapsed;
      this.chargeLevel = Math.max(this.chargeLevel, this.minChargeLevel);
      this.lightningSymbol.style.display = 'none';
    }
  
    updateDisplay() {
      this.battery.style.height = `${this.chargeLevel}%`;
      this.batteryPercentage.textContent = `${Math.round(this.chargeLevel)}%`;
      this.chargeRateDisplay.textContent = this.latestChargeRate;
    }
  
    handleAnimationEnd() {
      const newDuration = this.latestChargeRate > this.chargeThreshold ? Math.max(0.05, 265 / this.latestChargeRate) : 1;    
      document.documentElement.style.setProperty(CSS_PULSE_DURATION_VAR, `${newDuration}s`);
      this.lightningSymbol.style.animation = 'none';

      setTimeout(() => {
        this.lightningSymbol.style.animation = '';
      }, 0);
    }
  }
  