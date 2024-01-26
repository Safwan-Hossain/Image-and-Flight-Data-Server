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


const timeline1 = new TimelineGraph('timelineChart1');

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

    droneVisualizer.updateOrientation(orientation);
    motorGraph.updateChartData(motors);
    batteryGraph.updateChargeRate(batteryChargeValue);
    const val = Math.floor(Math.random() * 100);
    timeline1.updateGraph(val);
}

function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}
