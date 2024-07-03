# Image-and-Flight-Data-Server <img src="./images/rocket.gif" alt="Alt text" width="30"/>
# Image-and-Flight-Data-Server <img src="./images/helicopter.png" alt="Alt text" width="40" />
## 💼 Overview  🚁
This project was in collaboration with VanWyn Inc., NATO DIANA and the Canadian Department of National Defence. This application includes a node server that communicates with a wired AI driven camera system and a drone via serial connection. The data from these subsystems are visualized and displayed in a graphical user interface (GUI) using graphs and 3D mediums in real time. The application was primarily developed using HTML, CSS, JavaScript, and Node.js, along with additional tools like npm, Electron, Babel, and Webpack.

## ▶️ Running The Demo 
<img src="./images/dashboard.png" alt="Logo" width="500"/>
<div style="display: flex;">

<div style="flex: 30%; padding: 10px;">
   <h2>⚙️ Setup </h2>
   <ol>
      <li>Install <a href="https://nodejs.org/">Node.js</a></li>
      <li>Open Command Prompt in the project root directory</li>
      <li>Run:
      <pre><code>npm install
      npm build</code></pre>
      </li>
      <li>Wait for the setup and build processes to complete</li>
   </ol>
   <h3>🖥️ Starting the application</h3>
   <ol>
      <li>Open <strong>Command Prompt</strong> in the project root directory</li>
      <li>Type the command <code>npm start</code> and press enter</li>
      <li>In the application, under the <strong>Settings</strong> tab, navigate to <strong>Serial Ports</strong> and select <strong>Mock Serial Port</strong></li>
      <li>Navigate to the <strong>Charts</strong> page</li>
   </ol>
</div>

<div style="flex: 70%; padding: 10px;">
  <img src="./images/dashboard.png" alt="Image 2" height="100px" style="margin-top: 80px"/>

  <img src="./images/settings.png" alt="Image 2" height="100px" style="margin-top: 80px"/>
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
