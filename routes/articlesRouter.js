const articleRouter = require('express').Router();
const {
  getArticles,
  postArticle,
  getArticleByID,
  patchArticle,
  deleteArticle,
  getCommentsByArticleID,
  postComment,
} = require('../controllers/articles.js');
const { handle405 } = require('../errors/errors.js');

articleRouter.route('/')
  .get(getArticles)
  .post(postArticle)
  .all(handle405);

articleRouter.route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments')
  .get(getCommentsByArticleID)
  .post(postComment)
  .all(handle405);

module.exports = articleRouter;
