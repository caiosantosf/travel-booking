
exports.up = function(knex) {
  return knex.schema.alterTable('travels', (table) => {
    table.datetime('returnDate').notNullable()
    table.boolean('controlsSeats').notNullable()
    table.dropColumn('days')
    table.dropColumn('departurePlace')
    table.dropColumn('value')
  })
}

exports.down = function(knex) {
  table.dropColumn('returnDate')
  table.dropColumn('controlsSeats')
  table.integer('days').notNullable()
  table.string('departurePlace').notNullable()
  table.decimal('value', 10, 2).notNullable()
}