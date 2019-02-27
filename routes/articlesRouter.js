const articleRouter = require('express').Router();
const {
  getArticles,
  postArticle,
  getArticleByID,
  patchArticle,
} = require('../controllers/articles.js');

articleRouter.route('/')
  .get(getArticles)
  .post(postArticle);

articleRouter.route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticle);

module.exports = articleRouter;
