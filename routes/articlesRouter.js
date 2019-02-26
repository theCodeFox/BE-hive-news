const articleRouter = require('express').Router();
const { getArticles } = require('../controllers/articles.js');

articleRouter.route('/')
  .get(getArticles);

module.exports = articleRouter;
