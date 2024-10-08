const express = require('express');
const path = require('path');
const app = express();

// Listen on port 4000
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketConnected = new Set();
io.on('connection',onConnected);

function onConnected(socket){    
    socketConnected.add(socket);

    io.emit('clients-total',socketConnected.size);

    socket.on('disconnect', () => {
        socketConnected.delete(socket);
        io.emit('clients-total',socketConnected.size);

    });
    socket.on('message', (data) => {
        
        socket.broadcast.emit('chat-message', data)
    });
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    });
}