const articleRouter = require('express').Router();
const {
  getArticles,
  postArticle,
  getArticleByID,
  patchArticle,
  deleteArticle,
} = require('../controllers/articles.js');

articleRouter.route('/')
  .get(getArticles)
  .post(postArticle);

articleRouter.route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticle)
  .delete(deleteArticle);

module.exports = articleRouter;
