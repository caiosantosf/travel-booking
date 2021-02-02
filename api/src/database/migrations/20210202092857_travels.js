
exports.up = function (knex) {
  return knex.schema.createTable('travelValues', (table) => {
    table.increments('id').primary()
    table.integer('travel_id').notNullable()
    table.foreign('travel_id').references('travels.id')
    table.decimal('value', 10, 2).notNullable()
    table.decimal('onlyReturnValue', 10, 2).notNullable()
    table.decimal('onlyDepartureValue', 10, 2).notNullable()
    table.integer('initialAge').notNullable()
    table.integer('finalAge').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('travelValues')
}