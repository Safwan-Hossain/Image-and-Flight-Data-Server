// import { DataParser } from './modules/data-parser.js';
// // import { updateClient as updateWebpage } from './modules/value-updater.js';
// import { updateClient as updateWebpage } from './temp-value-updater.js';
// import { Config } from '../node_server/src/server-config.js';

// const SERVER_PORT = Config.server.serverPort;
// const socket = io('http://localhost:' + SERVER_PORT);

// document.addEventListener('DOMContentLoaded', (event) => {
//     const buttonContainer = document.getElementById('buttonContainer');
//     buttonContainer.addEventListener('click', handleButtonClick);
// });

// function handleButtonClick(event) {
//     // Check if the clicked element is a button
//     if (event.target.tagName === 'BUTTON') {

//       const targetData = event.target.dataset.buttonString;
//       targetLock(targetData)
//     }
//   }

// function targetLock(targetData) {
//     console.log('Asking Camera System To Lock Onto: ', targetData);
//     socket.emit('target_data', targetData);
//     // Add your JavaScript code here that you want to execute on button click
// }

// socket.on('arduinoData', (data) => {
//     console.log(data)
//     const ARRAY_DELIM  = '|';
//     const DATA_DELIM  = ',';

//     const ROLL_INDEX = 0;
//     const PITCH_INDEX = 1;
//     const YAW_INDEX = 2;

//     const parsedData = data.split(DATA_DELIM);
//     const MOTOR_SIGNAL_INDEX = 0;
//     const ORIENTATION_INDEX = 1;
    
//     let motors = parsedData[MOTOR_SIGNAL_INDEX].split(ARRAY_DELIM);
//     let orientation = parsedData[ORIENTATION_INDEX].split(ARRAY_DELIM);

//     motors = motors.map(motorSignal => formatMotorSignal(motorSignal));
 

// });

// function formatMotorSignal(number) {
//     return (number - 1000) / 1000;
// }