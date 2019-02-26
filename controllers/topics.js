const { getTopics } = require('../models/topics.js');

exports.sendAllTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};
