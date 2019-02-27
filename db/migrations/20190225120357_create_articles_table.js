
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary().notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('slug').inTable('topics').onDelete('CASCADE');
    articlesTable.string('author').references('username').inTable('users').onDelete('CASCADE');
    articlesTable.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
