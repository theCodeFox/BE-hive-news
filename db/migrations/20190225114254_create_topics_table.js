
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug', 50).primary().notNullable();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
