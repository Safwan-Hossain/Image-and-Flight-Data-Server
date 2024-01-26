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


// ========= GRAPH GUI =========

const dataPoints = [];

const maxDataAge = 60; // 1 minute in seconds

// const chart1 = createTimelineChart('timelineChart1');
const chart2 = createTimelineChart('timelineChart2');
const chart3 = createTimelineChart('timelineChart3');
const chart4 = createTimelineChart('timelineChart4');
const chart5 = createTimelineChart('timelineChart5');
const chart6 = createTimelineChart('timelineChart6');


function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}


function createTimelineChart(canvasId) {
    const dataPoints = [];
    const chartData = {
        labels: [],
        datasets: [{
            label: 'Location (X)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            data: dataPoints,
        }],
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
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

    return { chart: timelineChart, dataPoints: dataPoints, chartData: chartData };
}

function updateChart(chartObj, newValue) {
    const currentTime = new Date().getTime() / 1000;
    chartObj.dataPoints.push({ x: currentTime, y: newValue });

    // Remove data points older than 1 minute
    while (chartObj.dataPoints.length > 0 && chartObj.dataPoints[0].x < currentTime - maxDataAge) {
        chartObj.dataPoints.shift();
    }

    // Update x-axis minimum and maximum values
    chartObj.chart.options.scales.x.min = currentTime - maxDataAge;
    chartObj.chart.options.scales.x.max = currentTime;

    // Calculate time elapsed since each data point was added
    chartObj.chartData.labels = chartObj.dataPoints.map((point) => {
        const timeElapsed = (currentTime - point.x).toFixed(1);
        return `${timeElapsed}s ago`;
    });

    chartObj.chart.update();
}

function updateAllCharts() {
    const newValue = generateRandomNumber(0, 150);  // for demonstration, you can replace this logic
    // updateChart(chart1, generateRandomNumber(0, 150));
    updateChart(chart2, generateRandomNumber(0, 150));
    updateChart(chart3, generateRandomNumber(0, 150));
    updateChart(chart4, generateRandomNumber(0, 150));
    updateChart(chart5, generateRandomNumber(0, 150));
    updateChart(chart6, generateRandomNumber(0, 150));
}


function generateRandomNumber(minValue, randomMultiplier) {
    const newValue = minValue + (Math.random() * randomMultiplier);
    return newValue;
}
