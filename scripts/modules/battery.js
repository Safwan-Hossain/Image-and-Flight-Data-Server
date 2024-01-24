
let chargeLevel = 50;
const maxChargeLevel = 100;
const minChargeLevel = 0;
const chargeThreshold = 500;
const chargeSpeed = 0.05;
const dischargeSpeed = 0.05; 
const battery = document.querySelector('.charge');
const batteryPercentage = document.getElementById('batteryPercentage');
const lightningSymbol = document.getElementById('lightningSymbol');
const chargeSlider = document.getElementById('chargeSlider');
const chargeRateDisplay = document.getElementById('chargeRate');

let latestChargeRate = chargeThreshold;
let animationFrameId;
let lastUpdateTimestamp = null;

export function setChargeRate(newRate) {
    latestChargeRate = newRate;
}

function animate(timestamp) {
    if (lastUpdateTimestamp === null) {
        lastUpdateTimestamp = timestamp;
    }
    const elapsed = timestamp - lastUpdateTimestamp;
    
    const chargeRate = latestChargeRate;
    
    if (chargeRate > chargeThreshold) {
        const rateMultiplier = (chargeRate - chargeThreshold) / (1023 - chargeThreshold);
        chargeLevel += rateMultiplier * chargeSpeed * elapsed;
        chargeLevel = Math.min(chargeLevel, maxChargeLevel);
        lightningSymbol.style.display = 'block';
    } else {
        chargeLevel -= dischargeSpeed * elapsed;
        chargeLevel = Math.max(chargeLevel, minChargeLevel);
        lightningSymbol.style.display = 'none';
    }

    battery.style.height = `${chargeLevel}%`;
    batteryPercentage.textContent = `${Math.round(chargeLevel)}%`;
    chargeRateDisplay.textContent = chargeRate;
    lastUpdateTimestamp = timestamp;

    animationFrameId = requestAnimationFrame(animate);
}

function handleAnimationEnd() {
    const chargeRate = latestChargeRate;
    const newDuration = chargeRate > chargeThreshold ? Math.max(0.05, 265 / chargeRate) : 1;
    // lightningSymbol.style.animationDuration = `${newDuration}s`;
    
    document.documentElement.style.setProperty('--lightning-animation-duration', `${newDuration}s`);

    lightningSymbol.style.animation = 'none';
    setTimeout(() => {
        lightningSymbol.style.animation = '';
    }, 0);
}

function handleSliderChange() {
    chargeRateDisplay.textContent = chargeSlider.value;
    
    setChargeRate(parseInt(chargeSlider.value, 10));
}

lightningSymbol.addEventListener('animationend', handleAnimationEnd);

// chargeSlider.addEventListener('input', handleSliderChange);

// chargeRateDisplay.textContent = chargeSlider.value;
requestAnimationFrame(animate); 