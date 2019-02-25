const {
  articleData, topicData, userData, commentData,
} = require('../data/index.js');
const { createAuthorRef } = require('../utils/index.js');

const seed = (knex, Promise) => knex.migrate
  .rollback()
  .then(() => knex.migrate.latest())
  .then(() => knex('topics')
    .insert(topicData)
    .returning('*'))
  .then(() => knex('users')
    .insert(userData)
    .returning('*'))
  .then((users) => {
    const authorRef = createAuthorRef(users);
  });

module.exports = { seed };
