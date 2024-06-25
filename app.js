const express = require('express');

const app = express();
const userRouter = require('./routes/userRouter');


// Use middleware
app.use(express.json());
//app.use(express.static(`${__dirname}/public`));


//const tourRouter = require('./routes/tourRouter');
//const userRouter = require('./routes/userRouter');

//app.use('/api/v1/tours', tourRouter);
//app.use('/api/v1/users', userRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;