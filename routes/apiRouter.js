const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter.js');
const articleRouter = require('../routes/articlesRouter.js');
const commentsRouter = require('../routes/commentsRouter');
const usersRouter = require('../routes/usersRouter.js');
const { getEndpoints } = require('../controllers/api.js');
const { handle405 } = require('../errors/errors.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.route('/')
  .get(getEndpoints)
  .all(handle405);

module.exports = apiRouter;
