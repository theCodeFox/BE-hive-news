const {
  articleData, topicData, userData, commentData,
} = require('../data/index.js');
const { createAuthorRef, createTopicRef, formatArticles } = require('../utils/index.js');

const seed = (knex, Promise) => knex.migrate
  .rollback()
  .then(() => knex.migrate.latest())
  .then(() => {
    const topics = knex('topics').insert(topicData).returning('*');
    const users = knex('users').insert(userData).returning('*');
    return Promise.all([topics, users]);
  })
  .then((topicsAndUsers) => {
    const authorRef = createAuthorRef(topicsAndUsers[1]);
    const topicRef = createTopicRef(topicsAndUsers[0]);
    const formattedArticles = formatArticles(articleData, authorRef, topicRef);
    return knex('articles')
      .insert(formattedArticles)
      .returning('*');
  })
  .then(console.log);

module.exports = { seed };
