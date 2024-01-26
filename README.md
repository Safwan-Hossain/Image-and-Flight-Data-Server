# VanWyn-GUI 🛸
## Current Progress 🏁 
- Arduino sends data to a node server 
- A virtual mock Arduino is available
- Node server takes that data and relays that to the front-end
- The front-end parses the data and displays it to the webpage using graphs, diagrams and information tabs

## How to Run 🏃

### General ⚙️
   1. Install **node.js**
### Setup Arduino 🕹️
Note - An Arduino is not required to test out this
   1. Plug in an Arduino
   2. Upload [**ground_station.ino** ][arduino_code] to the Arduino
### Setup Node Server 🗃️
   1. Open **Command Prompt** in the **node_server** directory
   2. Type in "**node main.mjs**" to start up the server
### Opening the webpage 🖥️
   1. Open the project with **visual studio code**
   2. Download **Live Server** extension under the  extensions tab
   3. Right click [**index.html** ][index.html] and click open with live server
   4. Select the desired Arduino port. If you are not using an Arduino select **Mock Serial Port**


[arduino_code]: others/arduino/ground_station/ground_station.ino
[index.html]: src/frontend/html/index.html