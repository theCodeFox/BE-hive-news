const usersRouter = require('express').Router();
const {
  getUsers,
  postUser,
  getUserByUsername,
  getCommentsByUsername,
} = require('../controllers/users.js');
const { handle405 } = require('../errors/errors.js');

usersRouter.route('/')
  .get(getUsers)
  .post(postUser)
  .all(handle405);

usersRouter.route('/:username')
  .get(getUserByUsername)
  .all(handle405);

usersRouter.route('/:username/comments')
  .get(getCommentsByUsername)
  .all(handle405);

module.exports = usersRouter;
