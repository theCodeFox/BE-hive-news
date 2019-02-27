const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter.js');
const articleRouter = require('../routes/articlesRouter.js');
const commentsRouter = require('../routes/commentsRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
