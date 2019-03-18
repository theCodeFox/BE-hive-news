const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter.js');
const {
  handle400,
  handle404,
  handle422,
  handle500,
} = require('./errors/errors.js');

const app = express();

// for cors access - building front-end
app.use(cors());

// for POST requests!
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ status: 404, msg: 'Sorry, not found...' });
});

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
