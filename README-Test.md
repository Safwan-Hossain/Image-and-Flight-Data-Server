# Image-and-Flight-Data-Server 🚁
## 💼 Overview  
This project was in collaboration with VanWyn Inc., NATO DIANA and the Canadian Department of National Defence. This application includes a node server that communicates with a wired AI driven camera system and a drone via serial connection. The data from these subsystems are visualized and displayed in a graphical user interface (GUI) using graphs and 3D mediums in real time. The application was primarily developed using HTML, CSS, JavaScript, and Node.js, along with additional tools like npm, Electron, Babel, and Webpack.

## ▶️ Running The Demo 
<img src="./images/dashboard.png" alt="Logo" width="500"/>
<div style="display: flex;">

<div style="flex: 30%; padding: 10px;">
  <h2>⚙️ Setup </h2>
  <ol>
   <li>Install <a href="https://nodejs.org/">Node.js</a></li>
   <li>Open <strong>Command Prompt</strong> in the project root directory</li>
   <li>Type in <code>npm install</code> and click enter</li>
   <li>Wait for the setup to finish</li>
   </ol>
</div>

<div style="flex: 70%; padding: 10px;">
  <img src="./images/dashboard.png" alt="Image 2" height="100px" style="margin-top: 80px"/>
</div>

</div>

### ⚙️ Setup 
   1. Install [**node.js**][node.js]
   2. Open **Command Prompt** in the project root directory
   3. Type in "**npm install**" and click enter
   4. Wait for the setup to finish 
### 🖥️ Starting the application 
   1. Open **Command Prompt** in the project root directory
   2. Type the command "**npm start**" and press enter
   3. In the application, under the **Settings** tab, navigate to **Serial Ports** and select **Mock Serial Port**
   4. Navigate to the **Charts** page
### 🕹️ Setup Arduino - Optional
   1. Plug in an Arduino
   2. Upload [**ground_station.ino** ][arduino_code] to the Arduino
   3. In the application, under the **Settings** tab, navigate to **Serial Ports** and select your desired port

## 📋 Documentation  
Navigate to the [**documentation**][docs] folder to review the hazard analysis, software requirements specification, and software design documents for this project.

## 🔮 Future Development  
### 📡 Radio Communication System 
- The drone's main processor currently requires a wired connection to the computer
- We are working on developing a communication system that enables wireless communication with the drone via radio waves

<!-- File Links -->
[src/main]: src/main
[arduino_code]: others/arduino/ground_station/ground_station.ino
[index.html]: public/index.html
[node.js]: https://nodejs.org
[docs]: documentation

<!-- Images -->
[dashboard_image]: images/dashboard.png
