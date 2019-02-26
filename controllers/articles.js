const { fetchArticles } = require('../models/articles.js');

exports.getArticles = (req, res, next) => {
  const { author, topic } = req.query;
  fetchArticles()
    .then((articles) => {
      if (author) {
        const filteredByAuthor = articles.filter(obj => obj.author === author);
        res.status(200).send({ articles: filteredByAuthor });
      } else if (topic) {
        const filteredByTopic = articles.filter(obj => obj.topic === topic);
        console.log(filteredByTopic);
        res.status(200).send({ articles: filteredByTopic });
      } else res.status(200).send({ articles });
    });
};
