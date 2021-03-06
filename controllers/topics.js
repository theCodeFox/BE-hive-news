const { fetchTopics, addTopic } = require('../models/topics.js');

exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const topic = req.body;
  addTopic(topic)
    .then(([newTopic]) => {
      res.status(201).send({ topic: newTopic });
    })
    .catch(next);
};
