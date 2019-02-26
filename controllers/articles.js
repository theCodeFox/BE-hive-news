const { fetchArticles } = require('../models/articles.js');

exports.getArticles = (req, res, next) => {
  fetchArticles();
};
