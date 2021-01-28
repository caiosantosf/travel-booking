
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email', 255).notNullable().alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email', 255).alter()
  })
}
