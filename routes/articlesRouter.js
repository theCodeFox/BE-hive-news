const articleRouter = require('express').Router();
const { getArticles, postArticle, getArticleByID } = require('../controllers/articles.js');

articleRouter.route('/')
  .get(getArticles)
  .post(postArticle);

articleRouter.route('/:article_id')
  .get(getArticleByID);

module.exports = articleRouter;
