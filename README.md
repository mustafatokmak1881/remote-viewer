# Remote Viewer - Real-Time Remote Management Solution

[![Remote Viewer Usage OF Web Side](https://img.youtube.com/vi/2qXgZI4iFLI/0.jpg)](https://www.youtube.com/watch?v=2qXgZI4iFLI)

## 🌟 Notes
- ** All examples are given for localhost and tcp port 3033. Please change this to your own ip.

## 🌟 Features
- **Real-time Screen Sharing** - View remote screens with adjustable quality settings
- **Batch Command Execution** - Run multiple commands simultaneously across devices  
- **Platform** - Runs on Windows. Also adaptable for Linux or MacOS or Raspberry Pi
- 
## 📦 Installation
```bash
# Clone the repository
npm install remote-viewer
````

## 📦 Usage Backend(NodeJS) Side
```bash
const { server } = require('remote-viewer');
server.start(); // Listening 3033 tcp port as default
````
## 📦 Example Screen Of Backend(NodeJS) Side
![image](https://github.com/mustafatokmak1881/remote-viewer/blob/main/modules/images/remote-viewer-server-side.png)




## 📦 Usage ElectronJS Side
```bash
const { app, BrowserWindow } = require('electron');

// Remote Viewer Module
const RemoteViewer = require('remote-viewer').electron;
const remoteViewer = new RemoteViewer();

app.on('ready', () => {
    const main = new BrowserWindow();

    // Enter the IP address or domain instead of localhost of the NodeJS Server
    remoteViewer.initialize('localhost');
});
````
## 📦 Example Of ElectronJS Side
![image](https://github.com/mustafatokmak1881/remote-viewer/blob/main/modules/images/remote-viewer-electron-side.png)




## 📦 Usage Web Side
```bash
All Web Files at here:
https://github.com/mustafatokmak1881/remote-viewer/tree/main/modules/public


- ** Main Functions:
https://github.com/mustafatokmak1881/remote-viewer/blob/main/modules/public/js/screenViewer.js

- **Add your ip instead of localhost:
var info = {
  host: "localhost",
  port: 3033,
  dashboardId: new Date().getTime() + "-" + Math.floor(Math.random() * 99999),
};
````

