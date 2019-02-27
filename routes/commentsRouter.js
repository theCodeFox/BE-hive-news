const commentsRouter = require('express').Router();
const { patchComment } = require('../controllers/comments.js');
const { handle405 } = require('../db/utils/errors.js');

commentsRouter.route('/')
  .all(handle405);

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .all(handle405);

module.exports = commentsRouter;
