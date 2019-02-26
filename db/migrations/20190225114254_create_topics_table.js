
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug', 50).primary().notNullable();
    topicsTable.string('description').defaultTo('No description provided');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
