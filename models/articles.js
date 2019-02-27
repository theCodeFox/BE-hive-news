const connection = require('../db/connection.js');

exports.fetchArticles = (sort_by, order, limit) => connection('articles')
  .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
  .count({ comment_count: 'comment_id' })
  .fullOuterJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .orderBy(sort_by, order)
  .limit(limit);

exports.addArticle = article => connection('articles')
  .insert(article)
  .returning('*');

exports.fetchArticleByID = id => connection('articles')
  .select('*')
  .where('article_id', id);

exports.incrementVotes = (id, votes) => connection('articles')
  .select('*')
  .where('article_id', id)
  .increment('votes', votes)
  .returning('*');

exports.removeArticle = id => connection('comments')
  .del()
  .where('article_id', id)
  .then(() => connection('articles')
    .del()
    .where('article_id', id));

exports.fetchCommentsByArticleID = (id, sort_by, order, limit) => connection('comments')
  .select('comment_id', 'votes', 'created_at', 'author', 'body')
  .where('article_id', id)
  .orderBy(sort_by, order)
  .limit(limit);

exports.addComment = comment => connection('comments')
  .insert(comment)
  .returning('*');
