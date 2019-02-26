const { fetchArticles } = require('../models/articles.js');

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      console.log(articles);
      res.status(200).send({ articles });
    });
};
