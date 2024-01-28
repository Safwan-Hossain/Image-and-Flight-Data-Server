import { BatteryGraph } from './graphs/battery-graph.js'
import { DroneVisualizer } from './drone-visualizer.js';
import { MotorGraph } from './graphs/motor-graph.js';
import { TimelineGraph } from './graphs/timeline-graph.js';

// vtk
const vtkContainer = document.getElementById('vtkContainer');
const stlURL = '../../../assets/stl/drone_model_centered.stl';

const droneVisualizer = new DroneVisualizer(vtkContainer, stlURL);
droneVisualizer.initializeRenderer();

// battery
const battery = document.querySelector('.charge');
const batteryPercentage = document.getElementById('batteryPercentage');
const lightningSymbol = document.getElementById('lightningSymbol');
const chargeRateDisplay = document.getElementById('chargeRate');

const batteryGraph = new BatteryGraph(battery, batteryPercentage, lightningSymbol, chargeRateDisplay);

// motor graph
const motorGraphElement = document.getElementById('myBarChart'); // TODO - change name
const motorGraph = new MotorGraph(motorGraphElement);


const rotationGraph = new TimelineGraph('timelineChart1', ['Roll', 'Pitch', 'Yaw']);
rotationGraph.setTitle('ROTATION');
rotationGraph.setYAxisRange(0, 360, 60);

export function tempUpdateView(data) {
    const ARRAY_DELIM  = '|';
    const DATA_DELIM  = ',';

    const parsedData = data.split(DATA_DELIM);
    const BATTERY_INDEX = 2;
    const MOTOR_SIGNAL_INDEX = 0;
    const ORIENTATION_INDEX = 1;
    
    let motors = parsedData[MOTOR_SIGNAL_INDEX].split(ARRAY_DELIM);
    let orientation = parsedData[ORIENTATION_INDEX].split(ARRAY_DELIM);
    let batteryChargeValue = parsedData[BATTERY_INDEX].split(ARRAY_DELIM);

    motors = motors.map(motorSignal => formatMotorSignal(motorSignal));

    droneVisualizer.updateOrientation(orientation);
    motorGraph.updateChartData(motors);
    batteryGraph.updateChargeRate(batteryChargeValue);
    const val = Math.floor(Math.random() * 100);
    rotationGraph.updateGraph(orientation);
}

function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}
