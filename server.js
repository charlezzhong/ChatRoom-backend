const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');


// connect to the database
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(con => {
    console.log(con.connections);
    console.log('DB connection successful');
})


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// This listens for new connections from clients
io.on('connection', (socket) => {
    // This code runs when a client connects
    console.log('a user connected');
    
    // Set up event listeners for this socket instance
    socket.on('join', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('leave', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    socket.on('message', (message) => {
        console.log('message: ', message);
        // Broadcast the message to the room
        io.to(message.roomId).emit('message', message);
    });

    // This runs when the client disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('listening on *:3000');
});