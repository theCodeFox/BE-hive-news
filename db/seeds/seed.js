const {
  articleData, topicData, userData, commentData,
} = require('../data/index.js');
const {
  formatArticles,
  formatComments,
  createArticleRef,
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
    const formattedArticles = formatArticles(articleData);
    return knex('articles')
      .insert(formattedArticles)
      .returning('*');
  })
  .then((articles) => {
    const articleRef = createArticleRef(articles);
    const formattedComments = formatComments(commentData, articleRef);
    return knex('comments')
      .insert(formattedComments)
      .returning('*');
  });

module.exports = { seed };
