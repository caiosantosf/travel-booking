
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.string('notes', 1000)
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('notes')
  })
}
