const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter.js');
const articleRouter = require('../routes/articlesRouter.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
