
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('cpf', 11).notNullable().unique()
    table.string('phone', 11).notNullable().unique()
    table.string('email').unique()
    table.string('password', 8).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}