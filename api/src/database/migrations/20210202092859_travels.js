
exports.up = function (knex) {
  return knex.schema.createTable('travelDeparturePlaces', (table) => {
    table.increments('id').primary()
    table.integer('travel_id').notNullable()
    table.foreign('travel_id').references('travels.id')
    table.string('cep', 8).notNullable()
    table.string('homeAddress').notNullable()
    table.integer('addressNumber').notNullable()
    table.string('complement')
    table.string('neighborhood').notNullable()
    table.string('city').notNullable()
    table.string('state', 2).notNullable()
    table.datetime('departureDate').notNullable()
    table.datetime('returnDate').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('travelDeparturePlaces')
}
