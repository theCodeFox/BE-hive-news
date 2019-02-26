const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter.js');

const app = express();

// for POST requests!
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ status: 404, msg: 'Sorry, page not found...' });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === '23502' || err.code === '42601') res.status(400).send({ status: 400, msg: 'Please fill all required fields' });
});

module.exports = app;
