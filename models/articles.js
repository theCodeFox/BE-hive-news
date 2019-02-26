const connection = require('../db/connection.js');

exports.fetchArticles = sort_by => connection('articles')
  .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
  .count({ comment_count: 'comment_id' })
  .join('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .orderBy(sort_by);
