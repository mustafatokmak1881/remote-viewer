const { app, BrowserWindow } = require('electron');
const RemoteViewer = require('./index');
const remoteViewer = new RemoteViewer.electron();



app.on('ready', () => {
    const main = new BrowserWindow({});
    remoteViewer.initialize('localhost');
});