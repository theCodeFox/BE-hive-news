const {
  fetchArticles,
  addArticle,
  fetchArticleByID,
  incrementVotes,
  removeArticle,
  fetchCommentsByArticleID,
  addComment,
} = require('../models/articles.js');

exports.getArticles = (req, res, next) => {
  const {
    author,
    topic,
    sort_by = 'created_at',
    order = 'asc',
    limit = 10,
  } = req.query;
  fetchArticles(sort_by, order, limit)
    .then((articles) => {
      if (author) {
        const filteredByAuthor = articles.filter(obj => obj.author === author);
        res.status(200).send({ articles: filteredByAuthor });
      } else if (topic) {
        const filteredByTopic = articles.filter(obj => obj.topic === topic);
        res.status(200).send({ articles: filteredByTopic });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(err => next(err));
};

exports.postArticle = (req, res, next) => {
  const article = req.body;
  addArticle(article)
    .then(([newArticle]) => {
      res.status(201).send({ article: newArticle });
    })
    .catch(err => next(err));
};

exports.getArticleByID = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleByID(id)
    .then(([article]) => {
      if (!article) return Promise.reject({ code: '22001' });
      return res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;
  incrementVotes(id, votes)
    .then(([article]) => res.status(200).send({ article }))
    .catch(err => next(err));
};

exports.deleteArticle = (req, res, next) => {
  const id = req.params.article_id;
  removeArticle(id)
    .then((articlesDeleted) => {
      if (articlesDeleted === 1) res.sendStatus(204);
      else res.status(404).send({ status: 404, msg: 'Sorry, article_id not found...' });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticleID = (req, res, next) => {
  const id = req.params.article_id;
  const {
    sort_by = 'created_at',
    order = 'asc',
    limit = 10,
  } = req.query;
  fetchCommentsByArticleID(id, sort_by, order, limit)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err));
};

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const comment = req.body;
  comment.article_id = id;
  addComment(comment)
    .then(([newComment]) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(err => next(err));
};
