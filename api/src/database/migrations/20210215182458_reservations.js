
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.decimal('value', 10, 2).notNullable()
    table.string('status').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('value')
    table.dropColumn('status')
  })
}
