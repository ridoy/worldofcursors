const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const favicon = require('serve-favicon')
const path = require('path');

const app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const server = http.createServer(app);
const io = socketIo(server);

let userCount = 0;
app.use(express.static('public'));

io.on('connection', (socket) => {
    userCount++;
    io.emit('userCount', userCount);
    console.log('A user connected. Current user count: ', userCount);

    socket.on('mousemove', (data) => {
        // Broadcast the cursor position to all other clients
        socket.broadcast.emit('mousemove', { id: socket.id, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);
        console.log('A user disconnected. Current user count: ', userCount);
        socket.broadcast.emit('userDisconnected', { id: socket.id });
    });
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});

