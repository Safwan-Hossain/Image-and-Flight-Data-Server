import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

let serverProcess = null;

function createWindow () {
  // Start the Node server
  serverProcess = spawn('node', ['./src/backend/server/main.mjs']);

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hiddenInset', 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Adjust based on your security needs
    },
    icon: './public/assets/icons/app-icon.ico' // Example path to icon
  });

  mainWindow.maximize();
  // Load the index.html of the app.
  mainWindow.loadFile('./public/index.html'); // Adjust the path as needed
  const contextMenu = new Menu();
  contextMenu.append(new MenuItem({
    label: 'Inspect Element',
    click: (item, focusedWindow) => {
      focusedWindow.webContents.openDevTools();
    }
  }));

    mainWindow.webContents.on('context-menu', (e, params) => {
    contextMenu.popup(mainWindow, params.x, params.y);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Kill the server process when the app is closed
  if (serverProcess !== null) {
    serverProcess.kill();
    serverProcess = null;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
