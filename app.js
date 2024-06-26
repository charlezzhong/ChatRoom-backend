const express = require('express');

const app = express();
const userRouter = require('./routes/userRouter');
const cors = require('cors');


// Use middleware
app.use(express.json());
//app.use(express.static(`${__dirname}/public`));


// Enable CORS for all HTTP routes
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Optionally specify which methods to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Optionally specify allowed headers
    credentials: true // Optional, but set to true if you need to support credentials
}));



//const tourRouter = require('./routes/tourRouter');
//const userRouter = require('./routes/userRouter');

//app.use('/api/v1/tours', tourRouter);
//app.use('/api/v1/users', userRouter);
app.use('/api/v1/users', userRouter);
app.get('/test', (req, res) => {
    res.json({ message: 'CORS should work here!' });
});


module.exports = app;