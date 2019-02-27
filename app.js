const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter.js');
const { handle400, handle500 } = require('./db/utils/errors.js');

const app = express();

// for POST requests!
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ status: 404, msg: 'Sorry, not found...' });
});

app.use(handle400);
app.use(handle500);

module.exports = app;
