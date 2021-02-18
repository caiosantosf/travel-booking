
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.datetime('datetime').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('datetime')
  })
}
