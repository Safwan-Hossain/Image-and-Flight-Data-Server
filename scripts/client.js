import { DataParser } from './modules/data-parser.js';
// import { updateClient as updateWebpage } from './modules/value-updater.js';
import { updateClient as updateWebpage } from './temp-value-updater.js';
import { Config } from '../node_server/src/server-config.js';

import { ClientSocket } from './modules/client-socket.js'

const clientSocket = new ClientSocket();
clientSocket.tryConnectingToServer();
setInterval(() => {

  clientSocket.getSerialPortData();
}, 3000);


document.addEventListener('DOMContentLoaded', (event) => {
    const ejectButton = document.getElementById('eject-button');
    const refreshButton = document.getElementById('refresh-button');
    const selectElement = document.getElementById('option-select');
    const buttonContainer = document.getElementById('buttonContainer');

    refreshButton.addEventListener('click', (event) => {
      handleRefreshButtonClick(event)
    });

    ejectButton.addEventListener('click', (event) => {
      handleDisconnectButtonClick()
    });

    selectElement.addEventListener('change', (event) => {
        // Call a function when an option is selected
        handleOptionSelect(event.target.value);
    });

    // Function to be called when an option is selected
    function handleOptionSelect(value) {
      clientSocket.sendNewArduinoPathToServer(value);
    }

    
    buttonContainer.addEventListener('click', handleButtonClick);
});

function handleRefreshButtonClick(event) {
  const icon = event.currentTarget.querySelector('i');
  addSpinAnimation(icon);
  clientSocket.getSerialPortData();
}

function addSpinAnimation(element) {
  
  element.classList.add('spin');
  element.addEventListener('animationend', () => {
    element.classList.remove('spin');
  }, { once: true }); 

}

function handleDisconnectButtonClick() {
  clientSocket.disconnectCurrentSerialPort();
}

function handleButtonClick(event) {
    // Check if the clicked element is a button
    if (event.target.tagName === 'BUTTON') {

      const targetData = event.target.dataset.buttonString;
      targetLock(targetData)
    }
}

function targetLock(targetData) {
    console.log('Asking Camera System To Lock Onto: ', targetData);
    socket.emit('target_data', targetData);
}



function addButton(buttonString) {
    // Create a new button element
    const button = document.createElement('button');
    
    // Set the text of the button
    button.textContent = `${buttonString}`;
  
    // Use a data attribute to associate the string data with the button
    button.dataset.buttonString = buttonString;
    
    // Append the button to the container
    document.getElementById('buttonContainer').appendChild(button);
}
  
  // Example of adding buttons with different strings
  addButton('Drone A');
  addButton('Drone B');
  addButton('Drone C');















  

// socket.on('frame2', (data) => {
//     console.log("Image data received on javascript");

//     // Create an image object
//     const image = new Image();
//     image.onload = () => {
//         // Create a canvas element
//         const canvas = document.createElement('canvas');
//         canvas.width = image.width;
//         canvas.height = image.height;

//         // Get the canvas context
//         const ctx = canvas.getContext('2d');

//         // Draw the image onto the canvas
//         ctx.drawImage(image, 0, 0);

//         // Set the properties for the rectangle you want to draw
//         // For example, a red rectangle
//         ctx.strokeStyle = 'red';
//         ctx.lineWidth = 5;

//         // Replace these with your desired rectangle coordinates and dimensions
//         const rectX = 20;
//         const rectY = 20;
//         const rectWidth = 100;
//         const rectHeight = 50;

//         // Draw the rectangle
//         ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

//         // Convert the canvas to a data URL
//         const imageUrl = canvas.toDataURL('image/jpeg');

//         // Set the <img> tag's src to the new data URL
//         document.getElementById('video-stream').src = imageUrl;
//     };

//     // Set the image source to the data we received (must be after setting onload)
//     image.src = 'data:image/jpeg;base64,' + data;
// });
