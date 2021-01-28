
exports.up = function (knex) {
  return knex.schema.createTable('buses', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.json('layout').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('buses')
}