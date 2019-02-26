const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics.js');

topicsRouter.route('/')
  .get(sendAllTopics);

module.exports = topicsRouter;
