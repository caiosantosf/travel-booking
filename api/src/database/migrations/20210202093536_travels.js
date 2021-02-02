
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.dropColumn('returnDate')
  })
}

exports.down = function(knex) {
  table.datetime('returnDate').notNullable()
}