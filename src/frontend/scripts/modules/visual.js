import { setChargeRate } from './battery.js'
import { DroneVisualizer } from './drone-visualizer.js';

const vtkContainer = document.getElementById('vtkContainer');
const stlURL = '../../../assets/stl/drone_model_centered.stl';

const droneVisualizer = new DroneVisualizer(vtkContainer, stlURL);
droneVisualizer.initializeRenderer();

export function tempUpdateView(data) {
    const ARRAY_DELIM  = '|';
    const DATA_DELIM  = ',';

    const ROLL_INDEX = 0;
    const PITCH_INDEX = 1;
    const YAW_INDEX = 2;

    const parsedData = data.split(DATA_DELIM);
    const BATTERY_INDEX = 2;
    const MOTOR_SIGNAL_INDEX = 0;
    const ORIENTATION_INDEX = 1;
    
    let motors = parsedData[MOTOR_SIGNAL_INDEX].split(ARRAY_DELIM);
    let orientation = parsedData[ORIENTATION_INDEX].split(ARRAY_DELIM);
    let batteryChargeValue = parsedData[BATTERY_INDEX].split(ARRAY_DELIM);

    motors = motors.map(motorSignal => formatMotorSignal(motorSignal));

    // document.getElementById('input-roll').value = orientation[ROLL_INDEX];
    // document.getElementById('input-pitch').value = orientation[PITCH_INDEX];
    // document.getElementById('input-yaw').value = orientation[YAW_INDEX];

    droneVisualizer.updateOrientation(orientation);
    updateChartData(motors);
    setChargeRate(batteryChargeValue)
}

function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}


var ctx = document.getElementById('myBarChart').getContext('2d');
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['M1', 'M2', 'M3', 'M4'], 
        datasets: [{
            label: 'Motor Signals',
            data: [0, 0, 0, 0], 
            backgroundColor: ['green', 'green', 'green', 'green'], 
            borderColor: ['green', 'green', 'green', 'green'],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 1 
            }
        },
        animation: {
            duration: 100 
        },
        plugins: {
            legend: {
                display: false
            }
        },
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    }
});

function getColorForValue(value) {
    var red = value > 0.5 ? 255 : Math.round(510 * value);
    var green = value < 0.5 ? 255 : Math.round(510 * (1 - value));
    return 'rgb(' + red + ',' + green + ',0)';
}

function updateChartData(values) {
    myBarChart.data.datasets.forEach((dataset) => {
        dataset.data = values; 
        dataset.backgroundColor = values.map(value => getColorForValue(value)); 
        dataset.borderColor = dataset.backgroundColor;
    });
    myBarChart.update();
}

updateChartData([1,.5,.75,.25])