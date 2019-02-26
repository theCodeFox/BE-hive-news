const { fetchTopics, addTopic } = require('../models/topics.js');

// sends all topics
exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};

// takes new UNIQUE slug & description of slug and returns the posted topic obj
exports.postTopic = (req, res, next) => {
  const topic = req.body;
  addTopic(topic)
    .then(() => {
      res.status(201).send({ topic });
    })
    .catch(err => next(err));
};
