
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.boolean('lapChild').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('lapChild')
  })
}
