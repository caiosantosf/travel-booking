
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('password', 255).alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('password', 8).alter()
  })
}
