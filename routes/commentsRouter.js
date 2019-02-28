const commentsRouter = require('express').Router();
const { patchComment, deleteComment } = require('../controllers/comments.js');
const { handle405 } = require('../db/utils/errors.js');

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentsRouter;
