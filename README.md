# Image-and-Flight-Data-Server 🛸
## Brief Overview 🏁 
This project was in collaboration with VanWyn Inc., NATO DIANA and the Canadian Department of National Defence. This application includes a node server that communicates with a wired camera using Python and a drone via serial connection. The data from these subsystems are visualized and displayed in a graphical user interface (GUI) using graphs and 3D mediums in real time. The application was primarily developed using HTML, CSS, JavaScript, and Node.js, along with additional tools like npm, Electron, Babel, and Webpack.

## Running The Demo 🏃
### Setup ⚙️
   1. Install [**node.js**][node.js]
   2. Open **Command Prompt** in the project root directory
   3. Type in "**npm install**" and click enter
   4. Wait for the setup to finish 
### Opening the webpage 🖥️
   1. Open **Command Prompt** in the project root directory
   2. Type the command "**npm start**" and press enter
   3. Under the **Settings** tab, navigate to **Serial Ports** and select **Mock Serial Port**
   4. Navigate to the **Charts** page
### Setup Arduino 🕹️ - Optional
   1. Plug in an Arduino
   2. Upload [**ground_station.ino** ][arduino_code] to the Arduino
   3. Under the **Settings** tab, navigate to **Serial Ports** and select your desired port

## Documentation 📋 
Navigate to the [**documentation**][docs] folder to review the hazard analysis, software requirements specification, and software design documents for this project.

[src/main]: src/main
[arduino_code]: others/arduino/ground_station/ground_station.ino
[index.html]: public/index.html
[node.js]: https://nodejs.org
[docs]: documentation

