const { app, BrowserWindow } = require('electron');
const remoteViewer = require('./modules/electron');


app.on('ready', () => {
    const main = new BrowserWindow({});
});