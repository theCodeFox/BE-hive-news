const {
  fetchArticles,
  addArticle,
  fetchArticleByID,
  incrementVotes,
  removeArticle,
  fetchCommentsByArticleID,
  addComment,
  countArticles,
  countComments,
} = require('../models/articles.js');

exports.getArticles = (req, res, next) => {
  const {
    author,
    topic,
    sort_by = 'created_at',
    order = 'desc',
    limit = 10,
    p = 1,
  } = req.query;
  const conditions = {};
  if (author) conditions['articles.author'] = author;
  if (topic) conditions['articles.topic'] = topic;
  const articlesPromise = fetchArticles(sort_by, order, limit, conditions, p);
  const articlesCount = countArticles(conditions);
  return Promise.all([articlesPromise, articlesCount])
    .then(([articles, total_articles]) => {
      console.log({ articles, total_articles });
      res.status(200).send({ articles, total_articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const article = req.body;
  addArticle(article)
    .then(([newArticle]) => {
      res.status(201).send({ article: newArticle });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then(([article]) => {
      if (!article) return Promise.reject({ code: '22001' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes = 0 } = req.body;
  incrementVotes(article_id, inc_votes)
    .then(([article]) => res.status(200).send({ article }))
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then((articlesDeleted) => {
      if (articlesDeleted === 1) res.sendStatus(204);
      else res.status(404).send({ status: 404, msg: 'Sorry, article not found...' });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const {
    sort_by = 'created_at',
    order = 'desc',
    limit = 10,
    p = 1,
  } = req.query;
  const commentsPromise = fetchCommentsByArticleID(article_id, sort_by, order, limit, p);
  const commentsCount = countComments();
  return Promise.all([commentsPromise, commentsCount])
    .then(([comments, total_comments]) => {
      res.status(200).send({ comments, total_comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  comment.article_id = article_id;
  addComment(comment)
    .then(([newComment]) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};
