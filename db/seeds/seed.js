const {
  articleData, topicData, userData, commentData,
} = require('../data/index.js');
const {
  createArticleAuthorRef,
  createTopicRef,
  formatArticles,
  formatComments,
  createArticleRef,
  createCommentAuthorRef,
} = require('../utils/index.js');

const seed = (knex, Promise) => knex.migrate
  .rollback()
  .then(() => knex.migrate.latest())
  .then(() => {
    const topics = knex('topics').insert(topicData).returning('*');
    const users = knex('users').insert(userData).returning('*');
    return Promise.all([topics, users]);
  })
  .then(([topics, users]) => {
    const authorRef = createArticleAuthorRef(users);
    const topicRef = createTopicRef(topics);
    const formattedArticles = formatArticles(articleData, authorRef, topicRef);
    const articles = knex('articles')
      .insert(formattedArticles)
      .returning('*');
    return Promise.all([users, articles]);
  })
  .then(([users, articles]) => {
    const authorRef = createCommentAuthorRef(users);
    const articleRef = createArticleRef(articles);
    const formattedComments = formatComments(commentData, users, articles);
  });

module.exports = { seed };
