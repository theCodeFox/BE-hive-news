const express = require('express');
// const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter.js');

const app = express();

// for POST requests!
// app.use(bodyParser.json());

app.use('/api', apiRouter);

module.exports = app;
