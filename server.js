const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const app = require('./app');
const { createClient } = require('redis');

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

/*const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});*/
// Create Redis client
const redisClient = createClient({
    url: 'redis://localhost:6379'
});
redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});
redisClient.on('ready', () => {
    console.log('Connected to Redis');
});

// Connect the Redis client
redisClient.connect();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// This listens for new connections from clients
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', async (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);

        try {
            if (redisClient.isOpen) {
                // Load previous messages from Redis
                const messages = await redisClient.lRange(`messages:${roomId}`, 0, -1);
                messages.forEach((message) => {
                    socket.emit('message', JSON.parse(message));
                });
            } else {
                console.error('Redis client is not open');
            }
        } catch (err) {
            console.error('Redis error: ', err);
        }
    });

    socket.on('leave', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    socket.on('message', async (message) => {
        console.log('message: ', message);

        try {
            if (redisClient.isOpen) {
                // Save message to Redis
                await redisClient.rPush(`messages:${message.roomId}`, JSON.stringify(message));
            } else {
                console.error('Redis client is not open');
            }
        } catch (err) {
            console.error('Redis error: ', err);
        }

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