
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.string('travelType').notNullable()
    table.integer('departurePlace_id').notNullable()
    table.foreign('departurePlace_id').references('travelDeparturePlaces.id')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
    table.dropColumn('travelType')
    table.dropColumn('departurePlace_id')
  })
}
