
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary().notNullable();
    commentsTable.string('author')
      .references('username')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable.integer('article_id')
      .references('article_id')
      .inTable('articles')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    commentsTable.string('body', 500).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
