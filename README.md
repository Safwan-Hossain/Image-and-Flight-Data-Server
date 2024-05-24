# Image-and-Flight-Data-Server 🛸
## Brief Overview 🏁 
This project involves the development of a server and GUI system designed to communicate with various subsystems, such as cameras and drones, for real-time data visualization. The server is fully operational and is currently being polished for a better color scheme and animations. This project was in collaboration with VanWyn Inc., NATO diana and the Canadian Department of National Defence.

## How to Run 🏃
### General ⚙️
   1. Install [**node.js**][node.js]
### Setup Node Server 🗃️
   1. Open **Command Prompt** in the project root directory
   2. Type in "**npm install**" and click enter
   3. Wait for the setup to finish 
### Opening the webpage 🖥️
   1. Open **Command Prompt** in the directory [**src/main**][src/main]
   2. Type the command "**npm start**" and press enter
   3. If an Arduino is not plugged in, choose **Mock Serial Port**
   4. To use a custom Arduino, follow below
### Optional - Setup Arduino 🕹️
   1. Plug in an Arduino
   2. Upload [**ground_station.ino** ][arduino_code] to the Arduino

[src/main]: src/main
[arduino_code]: others/arduino/ground_station/ground_station.ino
[index.html]: src/frontend/html/index.html
[node.js]: https://nodejs.org/en

