const { articleData, topicData, userData, commentData } = require('../data/index.js');

// return knex.migrate
//         .rollback()
//         .then(() => knex.migrate.latest())
//         .then(() => {
//             // logic for seeding db
//             return connection('directors')

const seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*')
        .then(console.log);
    });
};

module.exports = { seed };
