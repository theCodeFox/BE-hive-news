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
  const { inc_votes } = req.body;
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
    order = 'asc',
    limit = 10,
  } = req.query;
  fetchCommentsByArticleID(article_id, sort_by, order, limit)
    .then(comments => res.status(200).send({ comments }))
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
