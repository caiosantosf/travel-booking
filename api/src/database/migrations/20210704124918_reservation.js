
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.boolean('active').defaultTo(true)
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('active').defaultTo(true)
  })
}
