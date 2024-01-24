const DRONE_NAME_LABEL = "DRONE NAME: ";
const IP_ADDRESS_LABEL = "IP ADDRESS: ";
const THREAT_LEVEL_LABEL = "THREAT LEVEL: ";
const LOCATION_LABEL = "LOCATION: ";
const VELOCITY_LABEL = "VELOCITY: ";
const ACCELERATION_LABEL = "ACCELERATION: ";
const TILT_LABEL = "TILT: ";
const WIND_SPEED_LABEL = "WIND SPEED: ";
const BATTERY_PERCENTAGE_LABEL = "BATTERY PERCENTAGE: ";


const droneNameItem = document.getElementById("drone-name");
const ipAddressItem = document.getElementById("ip-address");
const threatLevelItem = document.getElementById("threat-level");
const locationItem = document.getElementById("location");
const velocityItem = document.getElementById("velocity");
const accelerationItem = document.getElementById("acceleration");
const tiltItem = document.getElementById("tilt");
const windSpeedItem = document.getElementById("wind-speed");
const batteryPercentageItem = document.getElementById("battery-percentage");


export function updateMainView(droneState) {
    updateStateInformation(droneState);
    updateChart(droneState.location[0]);
}


function updateStateInformation(droneState) {
    droneNameItem.innerHTML = `<b>${DRONE_NAME_LABEL}</b> ${droneState.name}`;
    ipAddressItem.innerHTML = `<b>${IP_ADDRESS_LABEL}</b> ${droneState.ip}`;
    threatLevelItem.innerHTML = `<b>${THREAT_LEVEL_LABEL}</b> ${droneState.threatLevel}`;
    locationItem.innerHTML = `<b>${LOCATION_LABEL}</b> ${droneState.location}`;
    velocityItem.innerHTML = `<b>${VELOCITY_LABEL}</b> ${droneState.velocity}`;
    accelerationItem.innerHTML = `<b>${ACCELERATION_LABEL}</b> ${droneState.acceleration}`;
    tiltItem.innerHTML = `<b>${TILT_LABEL}</b> ${droneState.tilt}`;
    windSpeedItem.innerHTML = `<b>${WIND_SPEED_LABEL}</b> ${droneState.windSpeed}`;
    batteryPercentageItem.innerHTML = `<b>${BATTERY_PERCENTAGE_LABEL}</b> ${droneState.batteryPercentage}`;
}

function generateRandomDroneState() {
    let location = generateRandomVector(100, 200, 300, 25);
    let velocity = generateRandomVector(0, 10, 10, 10);
    let acceleration = generateRandomVector(2, 3, 10, 2);
    let tilt = generateRandomVector(5, 4, -10, 8);
    let windSpeed = generateRandomVector(20, 3, 1, 5);
    let batteryPercentage = generateRandomNumber(48, 0);

    let droneState = new DroneState("DRONE A", "192.108.22", "friendly", location, velocity, acceleration, tilt, windSpeed, batteryPercentage);
    return droneState;
}

function generateRandomVector(minValue1, minValue2, minValue3, randomMultiplier) {
    num1 = generateRandomNumber(minValue1, randomMultiplier);
    num2 = generateRandomNumber(minValue2, randomMultiplier);
    num3 = generateRandomNumber(minValue3, randomMultiplier);
    return [num1, num2, num3];
}

function generateRandomNumber(minValue, randomMultiplier) {
    const newValue = minValue + (Math.random() * randomMultiplier);
    return newValue;
}


// ========= GRAPH GUI =========

const dataPoints = [];
const maxDataAge = 60; // 1 minute in seconds
const chartData = {
    labels: [],
    datasets: [{
        label: 'Location (X)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        data: dataPoints,
    }],
};

const ctx = document.getElementById('timelineChart').getContext('2d');
const timelineChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: maxDataAge,
            },
            y: {
                min: -50,
                max: 150, 
                beginAtZero: true,
            },
        },
    },
});

// Function to update the chart with new data
function updateChart(newValue) {
    const currentTime = new Date().getTime() / 1000; // Convert to seconds
    dataPoints.push({ x: currentTime, y: newValue });
    console.log("time: " + currentTime  + ",y-value: " + newValue);

    // Remove data points older than 1 minute
    while (dataPoints.length > 0 && dataPoints[0].x < currentTime - maxDataAge) {
        dataPoints.shift();
    }

    // Update x-axis minimum and maximum values
    timelineChart.options.scales.x.min = currentTime - maxDataAge;
    timelineChart.options.scales.x.max = currentTime;

    // Calculate time elapsed since each data point was added
    chartData.labels = dataPoints.map((point) => {
        const timeElapsed = (currentTime - point.x).toFixed(1);
        return `${timeElapsed}s ago`;
    });

    timelineChart.update();
}


document.addEventListener('DOMContentLoaded', (event) => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.width = 300;
        canvas.height = 300;
    });
});