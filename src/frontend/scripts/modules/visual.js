import { BatteryGraph } from './graphs/battery-graph.js'
import { DroneVisualizer } from './drone-visualizer.js';
import { MotorGraph } from './graphs/motor-graph.js';
import { TimelineGraph } from './graphs/timeline-graph.js';
import { DataParser } from './data-parser.js';

// vtk
const vtkContainer = document.getElementById('vtkContainer');
const stlURL = '../../../assets/stl/drone_model_centered.stl';

const droneVisualizer = new DroneVisualizer(vtkContainer, stlURL);
// droneVisualizer.initializeRenderer();

// battery
const battery = document.querySelector('.charge');
const batteryPercentage = document.getElementById('batteryPercentage');
const lightningSymbol = document.getElementById('lightningSymbol');
const chargeRateDisplay = document.getElementById('chargeRate');

const batteryGraph = new BatteryGraph(battery, batteryPercentage, lightningSymbol, chargeRateDisplay);

// motor graph
const motorGraphElement = document.getElementById('myBarChart'); // TODO - change name
const motorGraph = new MotorGraph(motorGraphElement);


// const rotationGraph = new TimelineGraph('timelineChart1', ['Roll', 'Pitch', 'Yaw']);
// rotationGraph.setTitle('ORIENTATION');
// rotationGraph.setYAxisRange(0, 360, 60);

const dataParser = new DataParser();
dataParser.initialize();


export function tempUpdateView(data) {
    const ARRAY_DELIM  = '|';
    const DATA_DELIM  = ',';


    const parsedData = data.split(DATA_DELIM);
    const MOTOR_SIGNAL_INDEX = 3;
    const ORIENTATION_INDEX = 0;
    const BATTERY_INDEX = 5;
    console.log(data)
    
    let motors = parsedData[MOTOR_SIGNAL_INDEX].split(ARRAY_DELIM);
    let orientation = parsedData[ORIENTATION_INDEX].split(ARRAY_DELIM);
    // let batteryChargeValue = parsedData[BATTERY_INDEX].split(ARRAY_DELIM);
    let batteryChargeValue = 600;

    motors = motors.map(motorSignal => formatMotorSignal(motorSignal));

    const orientationDict = {roll: orientation[0], pitch: orientation[1], yaw: orientation[2]};
    droneVisualizer.updateOrientation(orientationDict);
    motorGraph.updateChartData(motors);
    batteryGraph.updateChargeRate(batteryChargeValue);
    
    // rotationGraph.updateGraph(orientation);
    dataParser.handleData(data);
}

function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}
