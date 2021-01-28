
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email', 255).notNullable().defaultTo('').alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email', 255).notNullable().alter()
  })
}
