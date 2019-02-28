const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topics.js');
const { handle405 } = require('../errors/errors.js');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(handle405);

module.exports = topicsRouter;
