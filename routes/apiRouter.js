const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter.js');
const articleRouter = require('../routes/articlesRouter.js');
const commentsRouter = require('../routes/commentsRouter');
const usersRouter = require('../routes/usersRouter.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
