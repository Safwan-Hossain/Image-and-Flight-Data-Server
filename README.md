# VanWyn-GUI
## Current Progress: 
- Arduino sends mock data to a node server
- Node server takes that data and relays that to a client javascript
- The client parses the data and displays it to the webpage

## How to Run

### General
   1. Install **node.js**
### Setup Arduino
   1. Plug in an arduino
   2. Upload **ground_station.ino** to arduino
### Setup Node Server
   2. Change the port number for **arduinoPort:** to whichever port your arduino is using
   3. Open **Command Prompt** in the **node_server** directory
   4. Make sure arduino is connected
   5. Type in "**node server.mjs**"
### Opening the webpage
   1. Open the project with visual studio code
   2. Download **Live Server** extension under the  extensions tab
   3. Right click **templates/index.html** and click open with live server
