const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('mousemove', (data) => {
        // Broadcast the cursor position to all other clients
        socket.broadcast.emit('mousemove', { id: socket.id, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.broadcast.emit('userDisconnected', { id: socket.id });
    });
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});

