const connection = require('../db/connection.js');

exports.fetchArticles = (sort_by, order, limit, conditions) => connection('articles')
  .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
  .count({ comment_count: 'comment_id' })
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .where(conditions)
  .groupBy('articles.article_id')
  .orderBy(sort_by, order)
  .limit(limit);

exports.countArticles = conditions => connection('articles')
  .where(conditions)
  .count('article_id')
  .then(() => ([{ count }]) => +count);

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

exports.removeArticle = id => connection('articles')
  .del()
  .where('article_id', id);

exports.fetchCommentsByArticleID = (id, sort_by, order, limit) => connection('comments')
  .select('comment_id', 'votes', 'created_at', 'author', 'body')
  .where('article_id', id)
  .orderBy(sort_by, order)
  .limit(limit);

exports.addComment = comment => connection('comments')
  .insert(comment)
  .returning('*');
