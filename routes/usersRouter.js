const usersRouter = require('express').Router();
const { getUsers, postUser } = require('../controllers/users.js');
const { handle405 } = require('../db/utils/errors.js');

usersRouter.route('/')
  .get(getUsers)
  .post(postUser)
  .all(handle405);

usersRouter.route('/:username')
  .all(handle405);

module.exports = usersRouter;
