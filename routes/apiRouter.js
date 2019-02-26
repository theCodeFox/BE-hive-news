const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter.js');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
